import { shiprocketClient } from "./shiprocket.client";
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";

export class ShiprocketService {
  // 1. Create Shiprocket Order & Shipment
  public async createShipment(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new Error(`Order not found: ${orderId}`);

    const isCod = order.paymentMethod === "COD";

    const payload = {
      order_id: order.orderNumber,
      order_date: new Date(order.createdAt).toISOString().replace("T", " ").substring(0, 19),
      pickup_location: env.SHIPROCKET_PICKUP_LOCATION,
      billing_customer_name: order.customerName || "Customer",
      billing_last_name: "",
      billing_address: (order.shippingAddress as any).addressLine1 || "Address Line 1",
      billing_address_2: (order.shippingAddress as any).addressLine2 || "",
      billing_city: order.shippingCity,
      billing_pincode: order.shippingPincode,
      billing_state: order.shippingState,
      billing_country: order.shippingCountry,
      billing_email: order.customerEmail,
      billing_phone: order.customerPhone || "9999999999",
      shipping_is_billing: true,
      order_items: order.items.map((item: any) => ({
        name: item.title,
        sku: item.sku,
        units: item.quantity,
        selling_price: item.price.toString(),
        discount: "0",
        tax: "0",
      })),
      payment_method: isCod ? "COD" : "Prepaid",
      sub_total: order.subtotal.toString(),
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    };

    const res: any = await shiprocketClient.post("/orders/create/adhoc", payload);

    const shipment = await prisma.shipment.create({
      data: {
        orderId: order.id,
        shiprocketShipmentId: res.shipment_id ? res.shipment_id.toString() : null,
        shiprocketOrderId: res.order_id ? res.order_id.toString() : null,
        status: "PROCESSING",
        isCod,
        codAmount: isCod ? order.total : 0,
        pickupLocation: env.SHIPROCKET_PICKUP_LOCATION,
      },
    });

    return shipment;
  }

  // 2. Courier Selection & AWB Generation
  public async generateAWB(shipmentId: string, preferredCourierId?: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: { order: true },
    });

    if (!shipment || !shipment.shiprocketShipmentId) {
      throw new Error(`Invalid shipment for AWB generation: ${shipmentId}`);
    }

    // Select courier automatically if not specified
    let courierId = preferredCourierId;
    if (!courierId) {
      const couriers: any = await shiprocketClient.get("/courier/serviceability", {
        pickup_postcode: "400001",
        delivery_postcode: shipment.order.shippingPincode,
        weight: 0.5,
        cod: shipment.isCod ? 1 : 0,
      });

      const availableCouriers = couriers.data?.available_courier_companies || [];
      if (availableCouriers.length === 0) {
        throw new Error(`No serviceability for pincode ${shipment.order.shippingPincode}`);
      }
      courierId = availableCouriers[0].courier_company_id.toString();
    }

    const awbRes: any = await shiprocketClient.post("/courier/assign/awb", {
      shipment_id: shipment.shiprocketShipmentId,
      courier_id: courierId,
    });

    const awbCode = awbRes.response?.data?.awb_code;

    const updatedShipment = await prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        awbCode: awbCode || shipment.awbCode,
        courierCompanyId: courierId,
        courierName: awbRes.response?.data?.courier_name || "Shiprocket Courier",
        status: "PICKUP_SCHEDULED",
        trackingUrl: awbCode ? `https://shiprocket.co/tracking/${awbCode}` : null,
      },
    });

    return updatedShipment;
  }

  // 3. Generate Label & Manifest
  public async generateLabel(shipmentIds: string[]) {
    const res: any = await shiprocketClient.post("/courier/generate/label", {
      shipment_id: shipmentIds,
    });
    return {
      labelUrl: res.label_url,
    };
  }

  // 4. Live Tracking Details
  public async getTracking(awbCode: string) {
    const res: any = await shiprocketClient.get(`/courier/track/awb/${awbCode}`);
    return res.tracking_data || res;
  }

  // 5. Create Return Order Request
  public async createReturnOrder(orderId: string, reason: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, shipments: true },
    });

    if (!order) throw new Error(`Order not found: ${orderId}`);

    const primaryShipment = order.shipments[0];

    const payload = {
      order_id: `RET-${order.orderNumber}`,
      order_date: new Date().toISOString().replace("T", " ").substring(0, 19),
      pickup_customer_name: order.customerName || "Customer",
      pickup_address: (order.shippingAddress as any).addressLine1 || "Address",
      pickup_city: order.shippingCity,
      pickup_state: order.shippingState,
      pickup_pincode: order.shippingPincode,
      pickup_phone: order.customerPhone || "9999999999",
      order_items: order.items.map((i: any) => ({
        name: i.title,
        sku: i.sku,
        units: i.quantity,
        selling_price: i.price.toString(),
      })),
      shipping_charges: 0,
      sub_total: order.subtotal.toString(),
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    };

    const res: any = await shiprocketClient.post("/orders/create/return", payload);

    const returnRecord = await prisma.return.create({
      data: {
        orderId: order.id,
        shiprocketReturnOrderId: res.order_id ? res.order_id.toString() : null,
        shiprocketReturnShipmentId: res.shipment_id ? res.shipment_id.toString() : null,
        returnAwbCode: res.awb_code || null,
        reason,
        status: "REQUESTED",
        refundAmount: order.total,
        refundStatus: "PENDING",
      },
    });

    return returnRecord;
  }

  // 6. Update Shipment Status from Webhook
  public async processShiprocketWebhook(payload: any) {
    const awbCode = payload.awb || payload.awb_code;
    const currentStatus = payload.current_status || payload.status;
    const statusCode = payload.current_status_id || payload.status_code;

    if (!awbCode) return;

    const shipment = await prisma.shipment.findUnique({ where: { awbCode } });
    if (!shipment) return;

    let mappedStatus: any = "IN_TRANSIT";
    if (currentStatus === "Delivered") mappedStatus = "DELIVERED";
    else if (currentStatus === "Out for Delivery") mappedStatus = "OUT_FOR_DELIVERY";
    else if (currentStatus?.includes("RTO")) mappedStatus = "RTO_INITIATED";
    else if (currentStatus === "RTO Delivered") mappedStatus = "RTO_DELIVERED";
    else if (currentStatus === "Canceled") mappedStatus = "CANCELLED";

    // Update shipment and append tracking event
    await prisma.shipment.update({
      where: { id: shipment.id },
      data: {
        status: mappedStatus,
        statusCode: statusCode ? parseInt(statusCode, 10) : shipment.statusCode,
      },
    });

    await prisma.shipmentEvent.create({
      data: {
        shipmentId: shipment.id,
        status: mappedStatus,
        statusCode: statusCode ? parseInt(statusCode, 10) : null,
        location: payload.location || payload.city || "Hub",
        activity: payload.activity || currentStatus || "Status update",
        timestamp: new Date(),
      },
    });

    // Update main order fulfillment status if delivered/RTO
    if (mappedStatus === "DELIVERED") {
      await prisma.order.update({
        where: { id: shipment.orderId },
        data: {
          fulfillmentStatus: "DELIVERED",
          status: "DELIVERED",
        },
      });
    } else if (mappedStatus === "RTO_DELIVERED") {
      await prisma.order.update({
        where: { id: shipment.orderId },
        data: {
          fulfillmentStatus: "RTO_DELIVERED",
          status: "RETURNED",
        },
      });
    }
  }
}

export const shiprocketService = new ShiprocketService();

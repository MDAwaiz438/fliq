import { prisma } from "../../lib/prisma";

export interface CreateOrderInput {
  email: string;
  phone?: string;
  customerName?: string;
  paymentMethod: "CARD" | "UPI" | "NET_BANKING" | "WALLET" | "COD";
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
  items: Array<{
    variantId: string;
    quantity: number;
  }>;
}

export class OrdersService {
  public async createOrder(input: CreateOrderInput) {
    const { email, phone, customerName, paymentMethod, shippingAddress, items } = input;

    return await prisma.$transaction(async (tx: any) => {
      // 1. Concurrency-Safe Atomic Stock Decrement
      const orderItemsData = [];
      let calculatedSubtotal = 0;

      for (const item of items) {
        // Find variant
        const variant = await tx.variant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });

        if (!variant) {
          throw new Error(`Variant not found: ${item.variantId}`);
        }

        // Atomic decrement with condition (gte check guarantees no negative inventory under race conditions)
        const updateResult = await tx.variant.updateMany({
          where: {
            id: item.variantId,
            inventoryQuantity: { gte: item.quantity },
          },
          data: {
            inventoryQuantity: { decrement: item.quantity },
          },
        });

        if (updateResult.count === 0) {
          throw new Error(`OUT_OF_STOCK: ${variant.title} (${variant.product.title}) does not have ${item.quantity} units available.`);
        }

        const itemTotal = Number(variant.price) * item.quantity;
        calculatedSubtotal += itemTotal;

        orderItemsData.push({
          productId: variant.productId,
          variantId: variant.id,
          title: `${variant.product.title} - ${variant.title}`,
          sku: variant.sku,
          quantity: item.quantity,
          price: variant.price,
        });
      }

      // 2. Atomic Customer Upsert & Increments (Prevents lost updates under concurrent customer orders)
      const customer = await tx.customer.upsert({
        where: { email },
        create: {
          email,
          phone: phone || null,
          firstName: customerName ? customerName.split(" ")[0] : null,
          lastName: customerName ? customerName.split(" ").slice(1).join(" ") : null,
          ordersCount: 1,
          totalSpent: calculatedSubtotal,
        },
        update: {
          ordersCount: { increment: 1 },
          totalSpent: { increment: calculatedSubtotal },
        },
      });

      const orderNumber = `FLQ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const shippingCost = calculatedSubtotal > 3000 ? 0 : 199;
      const totalAmount = calculatedSubtotal + shippingCost;

      // 3. Create Order with snapshot shipping location columns
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          customerEmail: email,
          customerPhone: phone || null,
          customerName: customerName || email,
          status: paymentMethod === "COD" ? "PENDING" : "PAID",
          financialStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
          fulfillmentStatus: "UNFULFILLED",
          paymentMethod,
          subtotal: calculatedSubtotal,
          shippingCost,
          total: totalAmount,
          shippingCity: shippingAddress.city,
          shippingState: shippingAddress.state,
          shippingPincode: shippingAddress.pincode,
          shippingCountry: shippingAddress.country || "IN",
          shippingAddress: shippingAddress,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    });
  }

  public async getOrderById(orderId: string) {
    return await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        shipments: { include: { events: true } },
        returns: true,
      },
    });
  }
}

export const ordersService = new OrdersService();

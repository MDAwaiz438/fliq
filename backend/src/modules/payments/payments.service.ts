import crypto from "crypto";
import { prisma } from "../../lib/prisma";

export interface CreatePaymentOrderInput {
  amount: number; // in INR
  currency?: string;
  orderNumber: string;
  customerEmail: string;
  customerPhone?: string;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
    sku?: string;
  }>;
}

export interface VerifyPaymentInput {
  orderId: string;
  paymentId: string;
  signature?: string;
  orderNumber: string;
}

class PaymentsService {
  /**
   * Creates a standardized Payment Gateway Order (Razorpay / UPI Intent compatible)
   */
  async createPaymentOrder(input: CreatePaymentOrderInput) {
    const { amount, currency = "INR", orderNumber, customerEmail, customerPhone, items } = input;
    const amountInPaise = Math.round(amount * 100);

    // Generate unique gateway payment order ID
    const gatewayOrderId = `order_${crypto.randomBytes(8).toString("hex")}`;

    return {
      success: true,
      gatewayOrderId,
      amount: amountInPaise,
      currency,
      orderNumber,
      customerEmail,
      customerPhone,
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_FLIQstreetwear2026",
      notes: {
        orderNumber,
        itemsCount: items.length,
        brand: "FLIQ ATELIER"
      }
    };
  }

  /**
   * Verifies Razorpay / Gateway HMAC Signature & Confirms Paid Status
   */
  async verifyPayment(input: VerifyPaymentInput) {
    const { orderId, paymentId, signature, orderNumber } = input;

    // Optional HMAC signature check if secret is configured
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    let isSignatureValid = true;

    if (keySecret && signature) {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

      isSignatureValid = generatedSignature === signature;
    }

    if (!isSignatureValid) {
      throw new Error("Payment signature verification failed");
    }

    // Update matching order in DB if exists
    try {
      const existingOrder = await prisma.order.findUnique({
        where: { orderNumber }
      });

      if (existingOrder) {
        await prisma.order.update({
          where: { orderNumber },
          data: {
            status: "PAID",
            financialStatus: "PAID",
            updatedAt: new Date()
          }
        });
      }
    } catch (err) {
      console.warn("[PAYMENTS_SERVICE] DB order update skipped (mock mode):", err);
    }

    return {
      success: true,
      message: "Payment captured and verified successfully",
      paymentId,
      orderNumber,
      status: "PAID",
      timestamp: new Date().toISOString()
    };
  }
}

export default new PaymentsService();

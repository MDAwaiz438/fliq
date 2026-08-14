import { Router, Request, Response } from "express";
import paymentsService from "./payments.service";

const router = Router();

// POST /api/payments/create-order
router.post("/create-order", async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, currency, orderNumber, customerEmail, customerPhone, items } = req.body;

    if (!amount || !orderNumber || !customerEmail) {
      res.status(400).json({ error: "amount, orderNumber, and customerEmail are required" });
      return;
    }

    const result = await paymentsService.createPaymentOrder({
      amount: Number(amount),
      currency: currency || "INR",
      orderNumber,
      customerEmail,
      customerPhone,
      items: items || []
    });

    res.status(200).json(result);
  } catch (error: any) {
    console.error("[PAYMENTS_CREATE_ERROR]", error);
    res.status(500).json({ error: error.message || "Failed to create payment order" });
  }
});

// POST /api/payments/verify
router.post("/verify", async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, paymentId, signature, orderNumber } = req.body;

    if (!paymentId || !orderNumber) {
      res.status(400).json({ error: "paymentId and orderNumber are required" });
      return;
    }

    const result = await paymentsService.verifyPayment({
      orderId: orderId || `order_${orderNumber}`,
      paymentId,
      signature,
      orderNumber
    });

    res.status(200).json(result);
  } catch (error: any) {
    console.error("[PAYMENTS_VERIFY_ERROR]", error);
    res.status(400).json({ error: error.message || "Payment verification failed" });
  }
});

export default router;

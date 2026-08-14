import { Router } from "express";
import { ordersService } from "./orders.service";

const router = Router();

// Create Order (Concurrency-safe)
router.post("/", async (req, res) => {
  try {
    const order = await ordersService.createOrder(req.body);
    res.json({ success: true, order });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Get Order Details with Tracking & Shipments
router.get("/:id", async (req, res) => {
  try {
    const order = await ordersService.getOrderById(req.params.id);
    if (!order) {
      res.status(404).json({ success: false, error: "Order not found" });
      return;
    }
    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

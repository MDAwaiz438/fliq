import { Router } from "express";
import { handleShiprocketWebhook } from "./shiprocket.webhook";
import { shiprocketService } from "./shiprocket.service";

const router = Router();

// Webhook Listener
router.post("/webhook", handleShiprocketWebhook);

// Create Shipment
router.post("/create-shipment", async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      res.status(400).json({ error: "orderId is required" });
      return;
    }
    const shipment = await shiprocketService.createShipment(orderId);
    res.json({ success: true, shipment });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Generate AWB & Courier Assignment
router.post("/generate-awb", async (req, res) => {
  try {
    const { shipmentId, preferredCourierId } = req.body;
    if (!shipmentId) {
      res.status(400).json({ error: "shipmentId is required" });
      return;
    }
    const updatedShipment = await shiprocketService.generateAWB(shipmentId, preferredCourierId);
    res.json({ success: true, shipment: updatedShipment });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Generate Shipping Label
router.post("/generate-label", async (req, res) => {
  try {
    const { shipmentIds } = req.body;
    if (!shipmentIds || !Array.isArray(shipmentIds)) {
      res.status(400).json({ error: "shipmentIds array is required" });
      return;
    }
    const labelData = await shiprocketService.generateLabel(shipmentIds);
    res.json({ success: true, ...labelData });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get Live Tracking Details
router.get("/tracking/:awb", async (req, res) => {
  try {
    const tracking = await shiprocketService.getTracking(req.params.awb);
    res.json({ success: true, tracking });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create Return Order Request
router.post("/return", async (req, res) => {
  try {
    const { orderId, reason } = req.body;
    if (!orderId || !reason) {
      res.status(400).json({ error: "orderId and reason are required" });
      return;
    }
    const returnRecord = await shiprocketService.createReturnOrder(orderId, reason);
    res.json({ success: true, return: returnRecord });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

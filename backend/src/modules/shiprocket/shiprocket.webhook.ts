import crypto from "crypto";
import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { webhookQueue } from "../../jobs/queue";

export const handleShiprocketWebhook = async (req: Request, res: Response): Promise<void> => {
  const payload = req.body || {};
  const shipmentId = payload.shipment_id || payload.order_id || "unknown";
  const statusId = payload.current_status_id || payload.status || "status";
  const timestamp = payload.etd || payload.timestamp || Date.now();

  // Synthetic unique event key generation for Shiprocket
  const rawKey = `shiprocket:${shipmentId}:${statusId}:${timestamp}`;
  const externalEventId = crypto.createHash("md5").update(rawKey).digest("hex");

  try {
    // 1. Synchronous Idempotency & Duplicate Check
    const existingLog = await prisma.webhookLog.findUnique({
      where: { externalEventId },
    });

    if (existingLog) {
      res.status(200).json({ status: "DUPLICATE_IGNORED" });
      return;
    }

    // 2. Log Webhook Receipt
    await prisma.webhookLog.create({
      data: {
        externalEventId,
        source: "SHIPROCKET",
        topic: payload.current_status || "shipment.update",
        payload,
        status: "PROCESSED",
      },
    });

    // 3. Enqueue Job to BullMQ & Return Immediate HTTP 200 OK (< 10ms)
    await webhookQueue.add("processShiprocketWebhook", {
      payload,
      eventId: externalEventId,
    });

    res.status(200).json({ status: "QUEUED" });
  } catch (err: any) {
    console.error(`[SHIPROCKET_WEBHOOK_ERROR] ${err.message}`);
    res.status(500).json({ error: "Shiprocket webhook handler failed" });
  }
};

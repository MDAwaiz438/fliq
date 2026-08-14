import { Router, Request, Response } from "express";
import waitlistService from "./waitlist.service";

const router = Router();

// POST /api/waitlist/join
router.post("/join", (req: Request, res: Response): void => {
  try {
    const { emailOrPhone, productSlug, productTitle, size, type } = req.body;
    const result = waitlistService.joinWaitlist({
      emailOrPhone,
      productSlug,
      productTitle,
      size,
      type
    });
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/waitlist/stats
router.get("/stats", (_req: Request, res: Response): void => {
  try {
    const result = waitlistService.getWaitlistStats();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
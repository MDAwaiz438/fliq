import { Router, Request, Response } from "express";
import couponsService from "./coupons.service";

const router = Router();

// GET /api/coupons/active
router.get("/active", (_req: Request, res: Response): void => {
  try {
    const coupons = couponsService.getActiveCoupons();
    res.status(200).json({ success: true, coupons });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/coupons/validate
router.post("/validate", (req: Request, res: Response): void => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      res.status(400).json({ error: "Coupon code is required" });
      return;
    }

    const result = couponsService.validateCoupon(code, Number(subtotal) || 0);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ valid: false, error: error.message });
  }
});

export default router;

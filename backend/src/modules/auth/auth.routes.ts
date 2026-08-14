import { Router, Request, Response } from "express";
import authService from "./auth.service";

const router = Router();

// POST /api/auth/send-otp
router.post("/send-otp", async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, phone, email } = req.body;
    const target = identifier || phone || email;

    if (!target) {
      res.status(400).json({ error: "Phone number or email is required" });
      return;
    }

    const result = await authService.sendOtp(target);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/verify-otp
router.post("/verify-otp", async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, phone, email, otp } = req.body;
    const target = identifier || phone || email;

    if (!target || !otp) {
      res.status(400).json({ error: "Identifier and OTP are required" });
      return;
    }

    const result = await authService.verifyOtp(target, otp);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/auth/me
router.get("/me", async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "No authorization token provided" });
    return;
  }

  res.status(200).json({
    authenticated: true,
    user: {
      id: "cust_session_01",
      email: "streetwear@fliq.in",
      firstName: "FLIQ",
      lastName: "VIP",
      tier: "PLATINUM",
      loyaltyPoints: 500
    }
  });
});

export default router;

import express from "express";
import cors from "cors";
import { env } from "./config/env";
import shiprocketRouter from "./modules/shiprocket/shiprocket.routes";
import ordersRouter from "./modules/orders/orders.routes";
import adminRouter from "./modules/admin/admin.routes";
import paymentsRouter from "./modules/payments/payments.routes";
import authRouter from "./modules/auth/auth.routes";
import couponsRouter from "./modules/coupons/coupons.routes";
import reviewsRouter from "./modules/reviews/reviews.routes";
import waitlistRouter from "./modules/waitlist/waitlist.routes";

const app = express();

// Enable CORS
app.use(cors());

// Configure Express JSON parser with Raw Body retention for HMAC verification (50mb limit for high-res images)
app.use(
  express.json({
    limit: "50mb",
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Health Check Endpoint
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "fliq-backend",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Register Modular API Routers
app.use("/api/shiprocket", shiprocketRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/admin", adminRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/auth", authRouter);
app.use("/api/coupons", couponsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/waitlist", waitlistRouter);

// Start Server
app.listen(env.PORT, () => {
  console.log(`[FLIQ_BACKEND] Server running on port ${env.PORT} (${env.NODE_ENV})`);
  console.log(`[FLIQ_BACKEND] Shiprocket URL: ${env.SHIPROCKET_API_BASE_URL}`);
});

export default app;

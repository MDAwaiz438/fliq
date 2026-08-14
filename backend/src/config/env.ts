import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "",
  
  REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
  REDIS_PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || undefined,

  SHIPROCKET_EMAIL: process.env.SHIPROCKET_EMAIL || "",
  SHIPROCKET_PASSWORD: process.env.SHIPROCKET_PASSWORD || "",
  SHIPROCKET_API_BASE_URL: process.env.SHIPROCKET_API_BASE_URL || "https://apiv2.shiprocket.in/v1/external",
  SHIPROCKET_WEBHOOK_SECRET: process.env.SHIPROCKET_WEBHOOK_SECRET || "shiprocket_mock_webhook_secret",
  SHIPROCKET_PICKUP_LOCATION: process.env.SHIPROCKET_PICKUP_LOCATION || "Primary Warehouse",

  SUPABASE_PROJECT_PASSWORD: process.env.SUPABASE_PROJECT_PASSWORD || "",
  SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "",
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY || "",
};

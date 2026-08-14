import Redis from "ioredis";
import { env } from "../config/env";

const inMemoryStore = new Map<string, { value: string; expiresAt: number }>();

let redisClient: Redis | null = null;
let useRedis = true;

try {
  redisClient = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    lazyConnect: true,
    maxRetriesPerRequest: 1,
  });

  redisClient.on("error", () => {
    useRedis = false;
  });
} catch {
  useRedis = false;
}

export const redis = redisClient;

export const setSuppressionKey = async (key: string, value: string, ttlSeconds = 120): Promise<void> => {
  if (useRedis && redisClient) {
    try {
      await redisClient.set(`suppress:${key}`, value, "EX", ttlSeconds);
      return;
    } catch {
      useRedis = false;
    }
  }
  inMemoryStore.set(`suppress:${key}`, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
};

export const isSuppressed = async (key: string): Promise<boolean> => {
  if (useRedis && redisClient) {
    try {
      const val = await redisClient.get(`suppress:${key}`);
      return val !== null;
    } catch {
      useRedis = false;
    }
  }
  const cached = inMemoryStore.get(`suppress:${key}`);
  if (!cached) return false;
  if (Date.now() > cached.expiresAt) {
    inMemoryStore.delete(`suppress:${key}`);
    return false;
  }
  return true;
};

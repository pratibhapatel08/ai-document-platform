import Redis from "ioredis";
import { env } from "../config/env";

let redisClient: Redis | null = null;

export const connectRedis = async (): Promise<void> => {
  if (!env.REDIS_URL) {
    console.warn("REDIS_URL not set — caching disabled");
    return;
  }

  redisClient = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
  });

  redisClient.on("error", (error: Error) => {
    console.error("Redis connection error:", error.message);
  });

  await redisClient.ping();
  console.log("Redis connected");
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};

export const getRedisClient = (): Redis | null => redisClient;

export const isRedisAvailable = (): boolean => {
  return redisClient?.status === "ready";
};

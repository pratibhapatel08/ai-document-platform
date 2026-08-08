import { createHash } from "crypto";
import { env } from "../config/env";
import { getRedisClient, isRedisAvailable } from "../lib/redis";

export const buildCacheKey = (...parts: string[]): string => {
  return parts.join(":");
};

export const hashCacheKey = (value: string): string => {
  return createHash("sha256").update(value).digest("hex");
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  if (!isRedisAvailable()) {
    return null;
  }

  const client = getRedisClient();
  if (!client) return null;

  const cached = await client.get(key);
  if (!cached) return null;

  try {
    return JSON.parse(cached) as T;
  } catch {
    return null;
  }
};

export const setCache = async <T>(
  key: string,
  value: T,
  ttlSeconds: number = env.CACHE_TTL_SECONDS,
): Promise<void> => {
  if (!isRedisAvailable()) {
    return;
  }

  const client = getRedisClient();
  if (!client) return;

  await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
};

export const deleteCache = async (key: string): Promise<void> => {
  if (!isRedisAvailable()) {
    return;
  }

  const client = getRedisClient();
  if (!client) return;

  await client.del(key);
};

export const deleteCacheByPattern = async (pattern: string): Promise<void> => {
  if (!isRedisAvailable()) {
    return;
  }

  const client = getRedisClient();
  if (!client) return;

  const keys = await client.keys(pattern);
  if (keys.length > 0) {
    await client.del(...keys);
  }
};

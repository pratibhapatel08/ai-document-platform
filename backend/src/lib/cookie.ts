import type { CookieOptions, Response } from "express";
import { env } from "../config/env";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const parseExpiryToMs = (expiresIn: string): number => {
  const match = /^(\d+)([smhd])$/.exec(expiresIn);

  if (!match) {
    return 7 * MS_PER_DAY;
  }

  const value = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * MS_PER_DAY;
    default:
      return 7 * MS_PER_DAY;
  }
};

export const getAuthCookieOptions = (): CookieOptions => {
  const isProduction = env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: parseExpiryToMs(env.JWT_EXPIRES_IN),
    path: "/",
  };
};

export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie(env.COOKIE_NAME, token, getAuthCookieOptions());
};

export const clearAuthCookie = (res: Response): void => {
  res.clearCookie(env.COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  });
};

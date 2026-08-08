import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import type { JwtPayload, UserRole } from "../types/user.types";

const isJwtPayload = (value: unknown): value is JwtPayload => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const payload = value as Record<string, unknown>;
  return typeof payload.sub === "string" && (payload.role === "user" || payload.role === "admin");
};

export const signAccessToken = (userId: string, role: UserRole): string => {
  const payload: JwtPayload = { sub: userId, role };
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (!isJwtPayload(decoded)) {
      throw new AppError("Invalid token payload", 401);
    }

    return decoded;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Invalid or expired token", 401);
  }
};

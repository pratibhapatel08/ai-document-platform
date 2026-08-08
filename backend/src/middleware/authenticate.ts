import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { verifyAccessToken } from "../lib/jwt";
import { User } from "../models/User.model";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { toAuthUser } from "../utils/user.mapper";

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies?.[env.COOKIE_NAME];

    if (!token || typeof token !== "string") {
      throw new AppError("Authentication required", 401);
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      throw new AppError("User no longer exists", 401);
    }

    req.user = toAuthUser(user);
    next();
  },
);

import type { Request, Response } from "express";
import { setAuthCookie } from "../lib/cookie";
import { getUserProfile, loginUser, registerUser } from "../services/auth.service";
import { sendSuccess } from "../utils/apiResponse";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import type { LoginInput, RegisterInput } from "../validators/auth.validator";

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const body = req.body as RegisterInput;
  const result = await registerUser(body);

  setAuthCookie(res, result.token);

  sendSuccess(res, "Registration successful", { user: result.user }, 201);
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const body = req.body as LoginInput;
  const result = await loginUser(body);

  setAuthCookie(res, result.token);

  sendSuccess(res, "Login successful", { user: result.user });
});

export const getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }

  const user = await getUserProfile(req.user.id);

  sendSuccess(res, "Profile retrieved successfully", { user });
});

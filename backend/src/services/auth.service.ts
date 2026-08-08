import { User } from "../models/User.model";
import { signAccessToken } from "../lib/jwt";
import { AppError } from "../utils/AppError";
import { toAuthUser } from "../utils/user.mapper";
import type { LoginInput, RegisterInput } from "../validators/auth.validator";
import type { AuthUser } from "../types/user.types";

export interface AuthResult {
  user: AuthUser;
  token: string;
}

export const registerUser = async (input: RegisterInput): Promise<AuthResult> => {
  const existingUser = await User.findOne({ email: input.email });

  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const user = await User.create({
    name: input.name,
    email: input.email,
    password: input.password,
    role: "user",
  });

  const token = signAccessToken(user._id.toString(), user.role);

  return {
    user: toAuthUser(user),
    token,
  };
};

export const loginUser = async (input: LoginInput): Promise<AuthResult> => {
  const user = await User.findOne({ email: input.email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await user.comparePassword(input.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signAccessToken(user._id.toString(), user.role);

  return {
    user: toAuthUser(user),
    token,
  };
};

export const getUserProfile = async (userId: string): Promise<AuthUser> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return toAuthUser(user);
};

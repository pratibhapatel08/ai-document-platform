import type { AuthUser } from "../types/user.types";

interface UserLike {
  _id: { toString(): string };
  name: string;
  email: string;
  role: AuthUser["role"];
  createdAt: Date;
  updatedAt: Date;
}

export const toAuthUser = (user: UserLike): AuthUser => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

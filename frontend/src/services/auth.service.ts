import { apiClient } from "@/lib/axios";
import type {
  ApiSuccessResponse,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/types";

const AUTH_BASE = "/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const { data } = await apiClient.post<ApiSuccessResponse<AuthResponse>>(
      `${AUTH_BASE}/login`,
      credentials,
    );

    if (!data.data?.user) {
      throw new Error("Login failed: no user returned");
    }

    return data.data.user;
  },

  async register(credentials: RegisterCredentials): Promise<User> {
    const { data } = await apiClient.post<ApiSuccessResponse<AuthResponse>>(
      `${AUTH_BASE}/register`,
      credentials,
    );

    if (!data.data?.user) {
      throw new Error("Registration failed: no user returned");
    }

    return data.data.user;
  },

  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<ApiSuccessResponse<AuthResponse>>(
      `${AUTH_BASE}/profile`,
    );

    if (!data.data?.user) {
      throw new Error("Failed to fetch profile");
    }

    return data.data.user;
  },

  async logout(): Promise<void> {
    // HttpOnly cookie is cleared server-side when a logout endpoint exists.
    // For now, client state is cleared via AuthContext.
    return Promise.resolve();
  },
};

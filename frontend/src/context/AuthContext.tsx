import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService } from "@/services/auth.service";
import type { LoginCredentials, RegisterCredentials, User } from "@/types";

interface AuthContextValue {
  currentUser: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async (): Promise<void> => {
    try {
      const user = await authService.getProfile();
      setCurrentUser(user);
    } catch {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      setLoading(true);
      await refreshProfile();
      setLoading(false);
    };

    void initializeAuth();
  }, [refreshProfile]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<User> => {
    const user = await authService.login(credentials);
    setCurrentUser(user);
    return user;
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials): Promise<User> => {
    const user = await authService.register(credentials);
    setCurrentUser(user);
    return user;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await authService.logout();
    setCurrentUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      loading,
      isAuthenticated: currentUser !== null,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [currentUser, loading, login, register, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

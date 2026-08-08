import { useAuth } from "@/context";
import { ADMIN_NAV_ITEMS, USER_NAV_ITEMS } from "@/lib/constants";
import type { UserRole } from "@/types";

interface NavLink {
  label: string;
  path: string;
}

export const useRoleNavigation = (): NavLink[] => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return [];
  }

  return currentUser.role === "admin"
    ? [...ADMIN_NAV_ITEMS]
    : [...USER_NAV_ITEMS];
};

export const useHasRole = (...roles: UserRole[]): boolean => {
  const { currentUser } = useAuth();
  return currentUser ? roles.includes(currentUser.role) : false;
};

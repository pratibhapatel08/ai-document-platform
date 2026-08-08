import { Loading } from "@/components/common";
import { useAuth } from "@/context";
import { ROUTES } from "@/lib/constants";
import type { UserRole } from "@/types";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

const getHomeRoute = (role: UserRole): string => {
  return role === "admin" ? ROUTES.ADMIN_DASHBOARD : ROUTES.DASHBOARD;
};

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, currentUser } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen message="Checking authentication..." />;
  }

  if (!isAuthenticated || !currentUser) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to={getHomeRoute(currentUser.role)} replace />;
  }

  return <>{children}</>;
};

interface PublicRouteProps {
  children: ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, loading, currentUser } = useAuth();

  if (loading) {
    return <Loading fullScreen message="Loading..." />;
  }

  if (isAuthenticated && currentUser) {
    return <Navigate to={getHomeRoute(currentUser.role)} replace />;
  }

  return <>{children}</>;
};

export { getHomeRoute };

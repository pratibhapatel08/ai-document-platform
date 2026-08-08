import { DashboardLayout } from "@/components/layout";
import {
  AdminDashboardPage,
  AllDocumentsPage,
  AnalyticsPage,
} from "@/pages/admin";
import { LoginPage, RegisterPage } from "@/pages/auth";
import {
  DashboardPage,
  DocumentDetailsPage,
  MyDocumentsPage,
  UploadPage,
} from "@/pages/dashboard";
import { SearchPage } from "@/pages/search";
import { ROUTES } from "@/lib/constants";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "./RouteGuards";

const UserLayout = () => (
  <ProtectedRoute allowedRoles={["user", "admin"]}>
    <DashboardLayout />
  </ProtectedRoute>
);

const AdminLayout = () => (
  <ProtectedRoute allowedRoles={["admin"]}>
    <DashboardLayout />
  </ProtectedRoute>
);

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path={ROUTES.REGISTER}
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route element={<UserLayout />}>
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.UPLOAD} element={<UploadPage />} />
        <Route path={ROUTES.MY_DOCUMENTS} element={<MyDocumentsPage />} />
        <Route path="/documents/:id" element={<DocumentDetailsPage />} />
        <Route path={ROUTES.SEARCH} element={<SearchPage />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={<AdminDashboardPage />}
        />

        <Route
          path={ROUTES.ADMIN_DOCUMENTS}
          element={<AllDocumentsPage />}
        />

        <Route
          path={ROUTES.ADMIN_ANALYTICS}
          element={<AnalyticsPage />}
        />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
};
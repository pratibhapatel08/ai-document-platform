export const APP_NAME = import.meta.env.VITE_APP_NAME ?? "AI Document Insights";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  UPLOAD: "/upload",
  MY_DOCUMENTS: "/documents",
  DOCUMENT_DETAIL: "/documents/:id",
  SEARCH: "/search",
  ADMIN_DASHBOARD: "/admin",
  ADMIN_DOCUMENTS: "/admin/documents",
  ADMIN_ANALYTICS: "/admin/analytics",
} as const;

export const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER] as const;

export const USER_NAV_ITEMS = [
  { label: "Dashboard", path: ROUTES.DASHBOARD },
  { label: "Upload", path: ROUTES.UPLOAD },
  { label: "My Documents", path: ROUTES.MY_DOCUMENTS },
  { label: "Search", path: ROUTES.SEARCH },
] as const;

export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", path: ROUTES.ADMIN_DASHBOARD },
  { label: "All Documents", path: ROUTES.ADMIN_DOCUMENTS },
  { label: "System Analytics", path: ROUTES.ADMIN_ANALYTICS },
] as const;

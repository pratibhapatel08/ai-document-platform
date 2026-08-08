import { apiClient } from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types";
import type {
  AdminDashboardStats,
  ListAdminDocumentsParams,
  PaginatedAdminDocuments,
} from "@/types/admin";
import type { Document } from "@/types/document";

const ADMIN_BASE = "/admin";

export const adminService = {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const { data } = await apiClient.get<ApiSuccessResponse<{ stats: AdminDashboardStats }>>(
      `${ADMIN_BASE}/dashboard`,
    );

    if (!data.data?.stats) {
      throw new Error("Failed to fetch admin dashboard stats");
    }

    return data.data.stats;
  },

  async listDocuments(params: ListAdminDocumentsParams = {}): Promise<PaginatedAdminDocuments> {
    const { data } = await apiClient.get<ApiSuccessResponse<PaginatedAdminDocuments>>(
      `${ADMIN_BASE}/documents`,
      { params },
    );

    if (!data.data) {
      throw new Error("Failed to fetch admin documents");
    }

    return data.data;
  },

  async refreshSummary(id: string): Promise<Document> {
    const { data } = await apiClient.post<ApiSuccessResponse<{ document: Document }>>(
      `${ADMIN_BASE}/refresh-summary/${id}`,
    );

    if (!data.data?.document) {
      throw new Error("Failed to refresh summary");
    }

    return data.data.document;
  },

  async deleteDocument(id: string): Promise<void> {
    await apiClient.delete(`/documents/${id}`);
  },
};

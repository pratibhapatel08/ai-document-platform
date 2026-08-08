import type { ProcessingStatus } from "./document";

export interface AdminDashboardStats {
  totalUsers: number;
  totalDocuments: number;
  processingDocuments: number;
  failedDocuments: number;
  completedDocuments: number;
}

export interface AdminDocumentListItem {
  id: string;
  title: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedByName: string;
  processingStatus: ProcessingStatus;
  processingError: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedAdminDocuments {
  documents: AdminDocumentListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type AdminDocumentStatusFilter = "all" | ProcessingStatus;

export interface ListAdminDocumentsParams {
  page?: number;
  limit?: number;
  status?: AdminDocumentStatusFilter;
}

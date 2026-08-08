import type { ProcessingStatus } from "./document.types";

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
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedAdminDocumentsResult {
  documents: AdminDocumentListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

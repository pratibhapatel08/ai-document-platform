export type ProcessingStatus = "processing" | "completed" | "failed";
export type DocumentFileType = "pdf" | "txt";

export interface Document {
  id: string;
  title: string;
  originalFileName: string;
  fileType: DocumentFileType;
  fileSize: number;
  extractedText: string;
  summary: string;
  uploadedBy: string;
  processingStatus: ProcessingStatus;
  processingError: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentListItem {
  id: string;
  title: string;
  originalFileName: string;
  fileType: DocumentFileType;
  fileSize: number;
  uploadedBy: string;
  processingStatus: ProcessingStatus;
  processingError: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedDocuments {
  documents: DocumentListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ListDocumentsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export type UploadStage = "idle" | "uploading" | "processing" | "completed" | "failed";

export interface UploadProgressState {
  stage: UploadStage;
  progress: number;
  message: string;
}

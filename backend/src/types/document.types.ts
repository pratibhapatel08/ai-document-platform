export const PROCESSING_STATUSES = ["processing", "completed", "failed"] as const;

export type ProcessingStatus = (typeof PROCESSING_STATUSES)[number];

export const DOCUMENT_FILE_TYPES = ["pdf", "txt"] as const;

export type DocumentFileType = (typeof DOCUMENT_FILE_TYPES)[number];

export interface DocumentResponse {
  id: string;
  title: string;
  originalFileName: string;
  fileType: DocumentFileType;
  fileSize: number;
  extractedText: string;
  summary: string;
  embedding: number[];
  uploadedBy: string;
  processingStatus: ProcessingStatus;
  processingError: string | null;
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedDocumentsResult {
  documents: DocumentListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

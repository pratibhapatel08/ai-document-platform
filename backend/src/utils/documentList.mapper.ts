import type { DocumentListItem } from "../types/document.types";

interface DocumentListLike {
  _id: { toString(): string };
  title: string;
  originalFileName: string;
  fileType: DocumentListItem["fileType"];
  fileSize: number;
  uploadedBy: { toString(): string } | string;
  processingStatus: DocumentListItem["processingStatus"];
  processingError: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const toDocumentListItem = (document: DocumentListLike): DocumentListItem => ({
  id: document._id.toString(),
  title: document.title,
  originalFileName: document.originalFileName,
  fileType: document.fileType,
  fileSize: document.fileSize,
  uploadedBy:
    typeof document.uploadedBy === "string"
      ? document.uploadedBy
      : document.uploadedBy.toString(),
  processingStatus: document.processingStatus,
  processingError: document.processingError ?? null,
  createdAt: document.createdAt,
  updatedAt: document.updatedAt,
});

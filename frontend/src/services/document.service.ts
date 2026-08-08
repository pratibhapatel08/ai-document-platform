import { apiClient } from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types";
import type {
  Document,
  DocumentListItem,
  ListDocumentsParams,
  PaginatedDocuments,
} from "@/types/document";

const DOCUMENTS_BASE = "/documents";

export const documentService = {
  async list(params: ListDocumentsParams = {}): Promise<PaginatedDocuments> {
    const { data } = await apiClient.get<ApiSuccessResponse<PaginatedDocuments>>(DOCUMENTS_BASE, {
      params,
    });

    if (!data.data) {
      throw new Error("Failed to fetch documents");
    }

    return data.data;
  },

  async getById(id: string): Promise<Document> {
    const { data } = await apiClient.get<ApiSuccessResponse<{ document: Document }>>(
      `${DOCUMENTS_BASE}/${id}`,
    );

    if (!data.data?.document) {
      throw new Error("Document not found");
    }

    return data.data.document;
  },

  async upload(
    title: string,
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<Document> {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    const { data } = await apiClient.post<ApiSuccessResponse<{ document: Document }>>(
      `${DOCUMENTS_BASE}/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (!event.total) return;
          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress?.(percent);
        },
      },
    );

    if (!data.data?.document) {
      throw new Error("Upload failed");
    }

    return data.data.document;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${DOCUMENTS_BASE}/${id}`);
  },
};

export type { DocumentListItem, Document };

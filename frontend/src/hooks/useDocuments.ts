import { documentService } from "@/services/document.service";
import { DOCUMENTS_PAGE_SIZE } from "@/utils/document.utils";
import type { DocumentListItem, PaginatedDocuments } from "@/types/document";
import { useCallback, useEffect, useState } from "react";

interface UseDocumentsOptions {
  initialSearch?: string;
}

interface UseDocumentsResult {
  documents: DocumentListItem[];
  pagination: PaginatedDocuments["pagination"];
  loading: boolean;
  error: string | null;
  search: string;
  setSearch: (value: string) => void;
  page: number;
  setPage: (page: number) => void;
  refresh: () => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
}

export const useDocuments = (options: UseDocumentsOptions = {}): UseDocumentsResult => {
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [pagination, setPagination] = useState<PaginatedDocuments["pagination"]>({
    page: 1,
    limit: DOCUMENTS_PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(options.initialSearch ?? "");
  const [page, setPage] = useState(1);

  const fetchDocuments = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const result = await documentService.list({
        page,
        limit: DOCUMENTS_PAGE_SIZE,
        search: search.trim() || undefined,
      });

      setDocuments(result.documents);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    void fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const deleteDocument = useCallback(
    async (id: string): Promise<void> => {
      await documentService.delete(id);
      await fetchDocuments();
    },
    [fetchDocuments],
  );

  return {
    documents,
    pagination,
    loading,
    error,
    search,
    setSearch,
    page,
    setPage,
    refresh: fetchDocuments,
    deleteDocument,
  };
};

import { adminService } from "@/services/admin.service";
import type {
  AdminDocumentListItem,
  AdminDocumentStatusFilter,
  PaginatedAdminDocuments,
} from "@/types/admin";
import { useCallback, useEffect, useState } from "react";

const PAGE_SIZE = 10;

export const useAdminDocuments = () => {
  const [documents, setDocuments] = useState<AdminDocumentListItem[]>([]);
  const [pagination, setPagination] = useState<PaginatedAdminDocuments["pagination"]>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [statusFilter, setStatusFilter] = useState<AdminDocumentStatusFilter>("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const result = await adminService.listDocuments({
        page,
        limit: PAGE_SIZE,
        status: statusFilter,
      });

      setDocuments(result.documents);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    void fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const deleteDocument = useCallback(
    async (id: string): Promise<void> => {
      await adminService.deleteDocument(id);
      await fetchDocuments();
    },
    [fetchDocuments],
  );

  const refreshSummary = useCallback(
    async (id: string): Promise<void> => {
      await adminService.refreshSummary(id);
      await fetchDocuments();
    },
    [fetchDocuments],
  );

  return {
    documents,
    pagination,
    loading,
    error,
    page,
    setPage,
    statusFilter,
    setStatusFilter,
    refresh: fetchDocuments,
    deleteDocument,
    refreshSummary,
  };
};

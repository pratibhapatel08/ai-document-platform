import { ErrorMessage } from "@/components/common";
import { DocumentListSkeleton, DocumentsEmptyState, Pagination } from "@/components/documents";
import { AdminTable, ConfirmationModal, StatsCard } from "@/components/admin";
import { Button } from "@/components/ui";
import { useToast } from "@/context";
import { useAdminDashboard, useAdminDocuments } from "@/hooks";
import type { AdminDocumentListItem, AdminDocumentStatusFilter } from "@/types/admin";
import { useState } from "react";

const STATUS_FILTERS: { label: string; value: AdminDocumentStatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Processing", value: "processing" },
  { label: "Failed", value: "failed" },
];

export const AllDocumentsPage = () => {
  const { showSuccess, showError } = useToast();
  const {
    documents,
    pagination,
    loading,
    error,
    page,
    setPage,
    statusFilter,
    setStatusFilter,
    refresh,
    deleteDocument,
    refreshSummary,
  } = useAdminDocuments();

  const [deleteTarget, setDeleteTarget] = useState<AdminDocumentListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);

  const handleDelete = async (): Promise<void> => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteDocument(deleteTarget.id);
      showSuccess("Document deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete document");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefreshSummary = async (document: AdminDocumentListItem): Promise<void> => {
    setRefreshingId(document.id);
    try {
      await refreshSummary(document.id);
      showSuccess(`Summary refreshed for "${document.title}"`);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to refresh summary");
    } finally {
      setRefreshingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Documents</h1>
          <p className="mt-1 text-sm text-slate-500">Manage documents across the entire platform.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => void refresh()}>
          Refresh
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setStatusFilter(filter.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === filter.value
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {error ? <ErrorMessage message={error} onRetry={() => void refresh()} /> : null}
      {loading ? <DocumentListSkeleton /> : null}

      {!loading && !error && documents.length === 0 ? (
        <DocumentsEmptyState
          icon="📂"
          title="No documents found"
          description="No documents match the selected filter."
        />
      ) : null}

      {!loading && !error && documents.length > 0 ? (
        <>
          <AdminTable
            documents={documents}
            onDelete={setDeleteTarget}
            onRefreshSummary={(doc) => void handleRefreshSummary(doc)}
            refreshingId={refreshingId}
          />
          <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </>
      ) : null}

      <ConfirmationModal
        isOpen={deleteTarget !== null}
        title="Delete document?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export const AnalyticsPage = () => {
  const { stats, loading, error, refresh } = useAdminDashboard();

  if (loading) return <DocumentListSkeleton />;

  if (error || !stats) {
    return <ErrorMessage message={error ?? "Failed to load analytics"} onRetry={() => void refresh()} />;
  }

  const successRate =
    stats.totalDocuments > 0
      ? Math.round((stats.completedDocuments / stats.totalDocuments) * 100)
      : 0;

  const failureRate =
    stats.totalDocuments > 0
      ? Math.round((stats.failedDocuments / stats.totalDocuments) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">Processing metrics and platform health overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total Users" value={stats.totalUsers} icon="👥" />
        <StatsCard label="Total Documents" value={stats.totalDocuments} icon="📄" />
        <StatsCard label="Success Rate" value={`${successRate}%`} icon="✅" trend="Completed / Total" />
        <StatsCard label="Failure Rate" value={`${failureRate}%`} icon="⚠️" trend="Failed / Total" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard label="Processing" value={stats.processingDocuments} />
        <StatsCard label="Completed" value={stats.completedDocuments} />
        <StatsCard label="Failed" value={stats.failedDocuments} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Processing breakdown</h3>
        <div className="mt-4 space-y-3">
          {[
            { label: "Completed", value: stats.completedDocuments, color: "bg-emerald-500" },
            { label: "Processing", value: stats.processingDocuments, color: "bg-amber-500" },
            { label: "Failed", value: stats.failedDocuments, color: "bg-red-500" },
          ].map((item) => {
            const width =
              stats.totalDocuments > 0 ? (item.value / stats.totalDocuments) * 100 : 0;

            return (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-medium text-slate-900">{item.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

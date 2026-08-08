import {
  DeleteConfirmationModal,
  DocumentCard,
  DocumentListSkeleton,
  DocumentTable,
  DocumentsEmptyState,
  Pagination,
} from "@/components/documents";
import { ErrorMessage } from "@/components/common";
import { Button, Input } from "@/components/ui";
import { useToast } from "@/context";
import { useDocuments } from "@/hooks";
import { ROUTES } from "@/lib/constants";
import type { DocumentListItem } from "@/types/document";
import { useState } from "react";
import { Link } from "react-router-dom";

interface DocumentListViewProps {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  showUploadAction?: boolean;
}

export const DocumentListView = ({
  title,
  description,
  emptyTitle,
  emptyDescription,
  showUploadAction = true,
}: DocumentListViewProps) => {
  const { showSuccess, showError } = useToast();
  const {
    documents,
    pagination,
    loading,
    error,
    search,
    setSearch,
    page,
    setPage,
    refresh,
    deleteDocument,
  } = useDocuments();

  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [deleteTarget, setDeleteTarget] = useState<DocumentListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getDetailPath = (id: string): string => `/documents/${id}`;

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => void refresh()}>
            Refresh
          </Button>
          <Button
            variant={viewMode === "grid" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === "table" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            Table
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Search by document title..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="flex-1"
        />
      </div>

      {error ? <ErrorMessage message={error} onRetry={() => void refresh()} /> : null}

      {loading ? <DocumentListSkeleton /> : null}

      {!loading && !error && documents.length === 0 ? (
        <DocumentsEmptyState
          title={emptyTitle}
          description={emptyDescription}
          icon="📂"
          action={
            showUploadAction ? (
              <Link to={ROUTES.UPLOAD}>
                <Button>Upload your first document</Button>
              </Link>
            ) : undefined
          }
        />
      ) : null}

      {!loading && !error && documents.length > 0 && viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              detailPath={getDetailPath(document.id)}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      ) : null}

      {!loading && !error && documents.length > 0 && viewMode === "table" ? (
        <DocumentTable
          documents={documents}
          getDetailPath={getDetailPath}
          onDelete={setDeleteTarget}
        />
      ) : null}

      {!loading && !error && documents.length > 0 ? (
        <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
      ) : null}

      <DeleteConfirmationModal
        isOpen={deleteTarget !== null}
        title="Delete document?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        isDeleting={isDeleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

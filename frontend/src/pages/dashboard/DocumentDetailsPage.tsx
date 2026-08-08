import { Loading } from "@/components/common";
import { ErrorMessage } from "@/components/common";
import { StatusBadge, SummaryCard } from "@/components/documents";
import { Button, Card } from "@/components/ui";
import { useToast } from "@/context";
import { documentService } from "@/services/document.service";
import { ROUTES } from "@/lib/constants";
import { formatDate } from "@/utils";
import { formatFileSize } from "@/utils/document.utils";
import type { Document } from "@/types/document";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export const DocumentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDocument = useCallback(async (): Promise<void> => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await documentService.getById(id);
      setDocument(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load document");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchDocument();
  }, [fetchDocument]);

  const handleDelete = async (): Promise<void> => {
    if (!id || !window.confirm("Are you sure you want to delete this document?")) return;

    setIsDeleting(true);
    try {
      await documentService.delete(id);
      showSuccess("Document deleted successfully");
      navigate(ROUTES.MY_DOCUMENTS);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete document");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading document..." />;
  }

  if (error || !document) {
    return (
      <ErrorMessage
        message={error ?? "Document not found"}
        onRetry={() => void fetchDocument()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link to={ROUTES.MY_DOCUMENTS} className="text-sm font-medium text-blue-600 hover:text-blue-700">
            ← Back to documents
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">{document.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={document.processingStatus} />
            <span className="text-sm text-slate-500">{formatDate(document.createdAt)}</span>
          </div>
        </div>
        <Button variant="danger" onClick={() => void handleDelete()} isLoading={isDeleting}>
          Delete
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Document Info" className="lg:col-span-1">
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-slate-500">Original file name</dt>
              <dd className="mt-1 font-medium text-slate-900">{document.originalFileName}</dd>
            </div>
            <div>
              <dt className="text-slate-500">File type</dt>
              <dd className="mt-1 font-medium uppercase text-slate-900">{document.fileType}</dd>
            </div>
            <div>
              <dt className="text-slate-500">File size</dt>
              <dd className="mt-1 font-medium text-slate-900">{formatFileSize(document.fileSize)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Upload date</dt>
              <dd className="mt-1 font-medium text-slate-900">{formatDate(document.createdAt)}</dd>
            </div>
            {document.processingError ? (
              <div>
                <dt className="text-slate-500">Processing error</dt>
                <dd className="mt-1 text-red-600">{document.processingError}</dd>
              </div>
            ) : null}
          </dl>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <SummaryCard summary={document.summary} />

          <Card title="Extracted Text" description="Raw text extracted from the uploaded file">
            {document.extractedText ? (
              <div className="max-h-[28rem] overflow-y-auto rounded-lg bg-slate-50 p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {document.extractedText}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No extracted text available.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

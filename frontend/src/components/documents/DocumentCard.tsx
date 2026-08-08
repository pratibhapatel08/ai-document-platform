import { StatusBadge } from "@/components/documents/StatusBadge";
import { Button } from "@/components/ui";
import { formatDate } from "@/utils";
import { formatFileSize } from "@/utils/document.utils";
import type { DocumentListItem } from "@/types/document";
import { Link } from "react-router-dom";

interface DocumentCardProps {
  document: DocumentListItem;
  detailPath: string;
  onDelete?: (document: DocumentListItem) => void;
}

export const DocumentCard = ({ document, detailPath, onDelete }: DocumentCardProps) => {
  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900">{document.title}</h3>
          <p className="mt-1 truncate text-sm text-slate-500">{document.originalFileName}</p>
        </div>
        <StatusBadge status={document.processingStatus} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-slate-500">Type</dt>
          <dd className="mt-0.5 font-medium uppercase text-slate-900">{document.fileType}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Size</dt>
          <dd className="mt-0.5 font-medium text-slate-900">{formatFileSize(document.fileSize)}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-slate-500">Uploaded</dt>
          <dd className="mt-0.5 font-medium text-slate-900">{formatDate(document.createdAt)}</dd>
        </div>
      </dl>

      <div className="mt-auto flex gap-2 pt-5">
        <Link
          to={detailPath}
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          View details
        </Link>
        {onDelete ? (
          <Button variant="danger" size="sm" onClick={() => onDelete(document)}>
            Delete
          </Button>
        ) : null}
      </div>
    </article>
  );
};

import { StatusBadge } from "@/components/documents/StatusBadge";
import { Button } from "@/components/ui";
import { formatDate } from "@/utils";
import { formatFileSize } from "@/utils/document.utils";
import type { DocumentListItem } from "@/types/document";
import { Link } from "react-router-dom";

interface DocumentTableProps {
  documents: DocumentListItem[];
  getDetailPath: (id: string) => string;
  onDelete?: (document: DocumentListItem) => void;
}

export const DocumentTable = ({ documents, getDetailPath, onDelete }: DocumentTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                File Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Uploaded
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.map((document) => (
              <tr key={document.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{document.title}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{document.originalFileName}</td>
                <td className="px-4 py-3 text-sm uppercase text-slate-600">{document.fileType}</td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {formatDate(document.createdAt)}
                  <span className="block text-xs text-slate-400">{formatFileSize(document.fileSize)}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={document.processingStatus} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={getDetailPath(document.id)}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                    >
                      View
                    </Link>
                    {onDelete ? (
                      <Button variant="ghost" size="sm" onClick={() => onDelete(document)}>
                        Delete
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import { StatusBadge } from "@/components/documents/StatusBadge";
import { Button } from "@/components/ui";
import { formatDate } from "@/utils";
import type { AdminDocumentListItem } from "@/types/admin";
import { Link } from "react-router-dom";

interface AdminTableProps {
  documents: AdminDocumentListItem[];
  onDelete: (document: AdminDocumentListItem) => void;
  onRefreshSummary: (document: AdminDocumentListItem) => void;
  refreshingId?: string | null;
}

export const AdminTable = ({
  documents,
  onDelete,
  onRefreshSummary,
  refreshingId = null,
}: AdminTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Uploaded By
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Upload Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.map((document) => (
              <tr key={document.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-slate-900">{document.title}</p>
                  <p className="text-xs text-slate-500">{document.originalFileName}</p>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{document.uploadedByName}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={document.processingStatus} />
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{formatDate(document.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Link
                      to={`/documents/${document.id}`}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                    >
                      View
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRefreshSummary(document)}
                      isLoading={refreshingId === document.id}
                    >
                      Refresh
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(document)}>
                      Delete
                    </Button>
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

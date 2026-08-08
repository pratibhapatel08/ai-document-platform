import { DocumentListSkeleton } from "@/components/documents";
import { Card } from "@/components/ui";
import { useAuth } from "@/context";
import { documentService } from "@/services/document.service";
import { ROUTES } from "@/lib/constants";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({ total: 0, completed: 0, processing: 0, failed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!currentUser) return;

  const loadStats = async (): Promise<void> => {
    try {
      const result = await documentService.list({
        page: 1,
        limit: 50,
      });

      const docs = result.documents;

      setStats({
        total: result.pagination.total,
        completed: docs.filter(
          (doc) => doc.processingStatus === "completed",
        ).length,
        processing: docs.filter(
          (doc) => doc.processingStatus === "processing",
        ).length,
        failed: docs.filter(
          (doc) => doc.processingStatus === "failed",
        ).length,
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);
    } finally {
      setLoading(false);
    }
  };

  void loadStats();
}, [currentUser]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back, {currentUser?.name}. Manage uploads, documents, and AI insights.
        </p>
      </div>

      {loading ? (
        <DocumentListSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card title="Total Documents" description={String(stats.total)} />
          <Card title="Completed" description={String(stats.completed)} />
          <Card title="Processing" description={String(stats.processing)} />
          <Card title="Failed" description={String(stats.failed)} />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          to={ROUTES.UPLOAD}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h3 className="font-semibold text-slate-900">Upload Document</h3>
          <p className="mt-2 text-sm text-slate-500">Add PDF or TXT files for AI processing.</p>
        </Link>
        <Link
          to={ROUTES.MY_DOCUMENTS}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h3 className="font-semibold text-slate-900">My Documents</h3>
          <p className="mt-2 text-sm text-slate-500">View and manage your uploaded documents.</p>
        </Link>
        <Link
          to={ROUTES.SEARCH}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h3 className="font-semibold text-slate-900">Search</h3>
          <p className="mt-2 text-sm text-slate-500">Find documents using semantic search.</p>
        </Link>
      </div>
    </div>
  );
};

import { ErrorMessage } from "@/components/common";
import { DocumentListSkeleton } from "@/components/documents";
import { DashboardCard, StatsCard } from "@/components/admin";
import { useAdminDashboard } from "@/hooks";
import { ROUTES } from "@/lib/constants";

export const AdminDashboardPage = () => {
  const { stats, loading, error, refresh } = useAdminDashboard();

  if (loading) {
    return <DocumentListSkeleton />;
  }

  if (error || !stats) {
    return (
      <ErrorMessage
        message={error ?? "Failed to load dashboard"}
        onRetry={() => void refresh()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Platform overview and administration tools.
        </p>
      </div>

      {/* Dashboard Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatsCard
          label="Total Users"
          value={stats.totalUsers}
          icon="👥"
        />

        <StatsCard
          label="Total Documents"
          value={stats.totalDocuments}
          icon="📄"
        />

        <StatsCard
          label="Processing"
          value={stats.processingDocuments}
          icon="⏳"
        />

        <StatsCard
          label="Failed"
          value={stats.failedDocuments}
          icon="⚠️"
        />

        <StatsCard
          label="Completed"
          value={stats.completedDocuments}
          icon="✅"
        />
      </div>

      {/* Admin Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="All Documents"
          description="Manage every document across the platform."
          href={ROUTES.ADMIN_DOCUMENTS}
          icon="📁"
        />

        <DashboardCard
          title="System Analytics"
          description="View processing metrics and platform health."
          href={ROUTES.ADMIN_ANALYTICS}
          icon="📊"
        />
      </div>
    </div>
  );
};
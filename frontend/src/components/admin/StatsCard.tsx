import { Button } from "@/components/ui";
import { cn } from "@/utils";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal = ({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onCancel} aria-hidden="true" />
      <div role="dialog" aria-modal="true" className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface StatsCardProps {
  label: string;
  value: number | string;
  icon?: ReactNode;
  trend?: string;
  className?: string;
}

export const StatsCard = ({ label, value, icon, trend, className }: StatsCardProps) => {
  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white p-5 shadow-sm", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          {trend ? <p className="mt-1 text-xs text-slate-400">{trend}</p> : null}
        </div>
        {icon ? (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

export const DashboardCard = ({ title, description, href, onClick, icon }: DashboardCardProps) => {
  const content = (
    <>
      {icon ? (
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-lg">
          {icon}
        </div>
      ) : null}
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </>
  );

  const className =
    "block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md";

  if (href) {
    return (
      <Link to={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${className} w-full text-left`}>
      {content}
    </button>
  );
};

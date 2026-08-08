import { cn } from "@/utils";
import { getStatusColor, getStatusLabel } from "@/utils/document.utils";
import type { ProcessingStatus } from "@/types/document";

interface StatusBadgeProps {
  status: ProcessingStatus;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        getStatusColor(status),
        className,
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
};

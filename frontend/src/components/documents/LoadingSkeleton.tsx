import { cn } from "@/utils";

interface LoadingSkeletonProps {
  className?: string;
  rows?: number;
}

export const LoadingSkeleton = ({ className, rows = 1 }: LoadingSkeletonProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-xl border border-slate-200 bg-white p-4"
        >
          <div className="h-4 w-1/3 rounded bg-slate-200" />
          <div className="mt-3 h-3 w-2/3 rounded bg-slate-100" />
          <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
};

export const DocumentListSkeleton = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-xl border border-slate-200 bg-white p-5"
        >
          <div className="h-5 w-2/3 rounded bg-slate-200" />
          <div className="mt-4 h-3 w-full rounded bg-slate-100" />
          <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
          <div className="mt-4 h-6 w-20 rounded-full bg-slate-100" />
        </div>
      ))}
    </div>
  );
};

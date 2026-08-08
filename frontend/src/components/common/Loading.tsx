import { cn } from "@/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

export const Spinner = ({ size = "md", className }: SpinnerProps) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-slate-200 border-t-blue-600",
        sizeMap[size],
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
};

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loading = ({ message = "Loading...", fullScreen = false }: LoadingProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-slate-600",
        fullScreen ? "min-h-screen" : "py-16",
      )}
    >
      <Spinner size="lg" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

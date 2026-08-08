import { Button } from "@/components/ui";
import { cn } from "@/utils";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage = ({
  title = "Something went wrong",
  message,
  onRetry,
  className,
}: ErrorMessageProps) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-red-200 bg-red-50 p-6 text-center",
        className,
      )}
      role="alert"
    >
      <h3 className="text-base font-semibold text-red-800">{title}</h3>
      <p className="mt-2 text-sm text-red-700">{message}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
};

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
};

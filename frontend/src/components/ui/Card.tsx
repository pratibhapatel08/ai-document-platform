import { cn } from "@/utils";
import type { ReactNode } from "react";

interface CardProps {
  children?: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export const Card = ({ children, className, title, description }: CardProps) => {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-6 shadow-sm", className)}>
      {title ? <h2 className="text-lg font-semibold text-slate-900">{title}</h2> : null}
      {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      {(title ?? description) ? <div className="mt-4">{children}</div> : children}
    </div>
  );
};

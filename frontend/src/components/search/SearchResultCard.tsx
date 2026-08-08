import { StatusBadge } from "@/components/documents/StatusBadge";
import { formatDate } from "@/utils";
import { highlightText } from "@/utils/highlightText";
import { getSummaryPreview } from "@/utils/search.utils";
import type { SemanticSearchResult } from "@/types/search";
import { Link } from "react-router-dom";

interface SearchResultCardProps {
  result: SemanticSearchResult;
  query: string;
}

export const SearchResultCard = ({ result, query }: SearchResultCardProps) => {
  const summaryPreview = getSummaryPreview(result.summary);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">
              {highlightText(result.title, query)}
            </h3>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">
              {Math.round(result.score * 100)}% match
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{result.originalFileName}</p>
        </div>
        <div className="text-right text-sm text-slate-500">
          <p>{formatDate(result.createdAt)}</p>
          <p className="mt-1 font-medium text-blue-600">Score: {result.score.toFixed(2)}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        {highlightText(summaryPreview, query)}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <StatusBadge status="completed" />
        <Link
          to={`/documents/${result.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View document →
        </Link>
      </div>
    </article>
  );
};

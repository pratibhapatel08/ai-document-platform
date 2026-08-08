import { Spinner } from "@/components/common";
import { cn } from "@/utils";
import type { FormEvent, KeyboardEvent } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  loading?: boolean;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({
  value,
  onChange,
  onSearch,
  onClear,
  loading = false,
  placeholder = "Search documents by meaning...",
  className,
}: SearchBarProps) => {
  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    onSearch();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSearch();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        {loading ? (
          <Spinner size="sm" />
        ) : (
          <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
          </svg>
        )}
      </div>

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pl-12 pr-24 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />

      <div className="absolute inset-y-0 right-2 flex items-center gap-1">
        {value ? (
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            Clear
          </button>
        ) : null}
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Search
        </button>
      </div>
    </form>
  );
};

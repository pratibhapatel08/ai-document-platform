import { ErrorMessage } from "@/components/common";
import { DocumentListSkeleton } from "@/components/documents";
import { SearchBar, SearchEmptyState, SearchResultCard } from "@/components/search";
import { useDebounce, useSemanticSearch } from "@/hooks";
import { useEffect, useState } from "react";

export const SearchPage = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const { results, loading, error, hasSearched, search, clear } = useSemanticSearch();

  useEffect(() => {
    if (debouncedQuery.trim()) {
      void search(debouncedQuery);
    }
  }, [debouncedQuery, search]);

  const handleClear = (): void => {
    setQuery("");
    clear();
  };

  const handleSearch = (): void => {
    void search(query);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Semantic Search</h1>
        <p className="mt-1 text-sm text-slate-500">
          Find documents by meaning using AI embeddings and vector similarity — not keyword matching.
        </p>
      </div>

      <SearchBar
        value={query}
        onChange={setQuery}
        onSearch={handleSearch}
        onClear={handleClear}
        loading={loading}
      />

      {error ? <ErrorMessage message={error} onRetry={handleSearch} /> : null}

      {loading ? <DocumentListSkeleton /> : null}

      {!loading && hasSearched && results.length === 0 && !error ? (
        <SearchEmptyState query={query} />
      ) : null}

      {!loading && results.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            {results.length} result{results.length === 1 ? "" : "s"} ranked by similarity
          </p>
          {results.map((result) => (
            <SearchResultCard key={result.id} result={result} query={query} />
          ))}
        </div>
      ) : null}

      {!loading && !hasSearched && !query ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
          <p className="text-4xl">🔍</p>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">Search by meaning</h3>
          <p className="mt-2 text-sm text-slate-500">
            Type a question or topic above. Results appear after 500ms or when you press Enter.
          </p>
        </div>
      ) : null}
    </div>
  );
};

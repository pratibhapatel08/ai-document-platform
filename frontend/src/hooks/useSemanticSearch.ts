import { searchService } from "@/services/search.service";
import type { SemanticSearchResult } from "@/types/search";
import { useCallback, useState } from "react";

export const useSemanticSearch = () => {
  const [results, setResults] = useState<SemanticSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const search = useCallback(async (query: string): Promise<void> => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setError(null);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await searchService.search(trimmed);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
    setHasSearched(false);
  }, []);

  return { results, loading, error, hasSearched, search, clear };
};

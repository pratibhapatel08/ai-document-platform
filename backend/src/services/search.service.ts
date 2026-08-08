import { buildCacheKey, getCache, hashCacheKey, setCache } from "./cache.service";
import { generateQueryEmbedding } from "./embedding.service";
import { searchSimilarDocuments } from "./vectorSearch.service";
import type { SemanticSearchResult } from "../types/search.types";

const SEARCH_CACHE_PREFIX = "search";

export const searchDocumentsByQuery = async (query: string): Promise<SemanticSearchResult[]> => {
  const normalizedQuery = query.trim().toLowerCase();
  const cacheKey = buildCacheKey(SEARCH_CACHE_PREFIX, hashCacheKey(normalizedQuery));

  const cached = await getCache<SemanticSearchResult[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const queryEmbedding = await generateQueryEmbedding(query);
  const results = await searchSimilarDocuments(queryEmbedding);

  await setCache(cacheKey, results);

  return results;
};

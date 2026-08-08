import { apiClient } from "@/lib/axios";
import type { SemanticSearchResponse } from "@/types/search";

export const searchService = {
  async search(query: string): Promise<SemanticSearchResponse["results"]> {
    const { data } = await apiClient.get<SemanticSearchResponse>("/documents/search", {
      params: { q: query },
    });

    return data.results ?? [];
  },
};

export interface SemanticSearchResult {
  id: string;
  title: string;
  originalFileName: string;
  summary: string;
  score: number;
  createdAt: string;
}

export interface SemanticSearchResponse {
  success: true;
  results: SemanticSearchResult[];
}

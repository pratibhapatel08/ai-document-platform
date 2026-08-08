export interface SemanticSearchResult {
  id: string;
  title: string;
  originalFileName: string;
  summary: string;
  score: number;
  createdAt: Date;
}

export interface SemanticSearchApiResponse {
  success: true;
  results: SemanticSearchResult[];
}

export interface VectorSearchAggregationResult {
  _id: { toString(): string };
  title: string;
  originalFileName: string;
  summary: string;
  createdAt: Date;
  score: number;
}

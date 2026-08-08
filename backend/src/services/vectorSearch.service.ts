import { env } from "../config/env";
import {
  VECTOR_SEARCH_DEFAULT_LIMIT,
  VECTOR_SEARCH_NUM_CANDIDATES_MULTIPLIER,
} from "../constants/embedding.constants";
import { Document } from "../models/Document.model";
import { AppError } from "../utils/AppError";
import { roundSimilarityScore } from "../utils/embedding.helpers";
import type { SemanticSearchResult, VectorSearchAggregationResult } from "../types/search.types";

interface VectorSearchStage {
  $vectorSearch: {
    index: string;
    path: string;
    queryVector: number[];
    numCandidates: number;
    limit: number;
    filter: {
      processingStatus: "completed";
    };
  };
}

interface VectorSearchProjectStage {
  $project: {
    _id: number;
    title: number;
    originalFileName: number;
    summary: number;
    createdAt: number;
    score: { $meta: "vectorSearchScore" };
  };
}

type VectorSearchPipeline = [VectorSearchStage, VectorSearchProjectStage];

const buildVectorSearchPipeline = (
  queryEmbedding: number[],
  limit: number,
): VectorSearchPipeline => {
  return [
    {
      $vectorSearch: {
        index: env.ATLAS_VECTOR_SEARCH_INDEX,
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: limit * VECTOR_SEARCH_NUM_CANDIDATES_MULTIPLIER,
        limit,
        filter: {
          processingStatus: "completed",
        },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        originalFileName: 1,
        summary: 1,
        createdAt: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ];
};

const mapSearchResults = (results: VectorSearchAggregationResult[]): SemanticSearchResult[] => {
  return results
    .map((result) => ({
      id: result._id.toString(),
      title: result.title,
      originalFileName: result.originalFileName,
      summary: result.summary,
      score: roundSimilarityScore(result.score),
      createdAt: result.createdAt,
    }))
    .sort((left, right) => right.score - left.score);
};

export const searchSimilarDocuments = async (
  queryEmbedding: number[],
  limit: number = env.VECTOR_SEARCH_LIMIT ?? VECTOR_SEARCH_DEFAULT_LIMIT,
): Promise<SemanticSearchResult[]> => {
  if (queryEmbedding.length === 0) {
    throw new AppError("Query embedding cannot be empty", 400);
  }

  try {
    const pipeline = buildVectorSearchPipeline(queryEmbedding, limit);
    const results = await Document.aggregate<VectorSearchAggregationResult>(pipeline);

    return mapSearchResults(results);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Vector search failed";
    throw new AppError(message, 502);
  }
};

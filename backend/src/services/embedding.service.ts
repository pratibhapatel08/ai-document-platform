import { AppError } from "../utils/AppError";
import { prepareTextForEmbedding } from "../utils/embedding.helpers";
import { openaiService } from "./ai.service";
import type { OpenAIEmbeddingClient } from "../types/openai.types";

export const generateDocumentEmbedding = async (
  extractedText: string,
  client: OpenAIEmbeddingClient = openaiService,
): Promise<number[]> => {
  const preparedText = prepareTextForEmbedding(extractedText);

  if (preparedText.length === 0) {
    throw new AppError("Cannot generate embedding from empty document text", 422);
  }

  const { embedding } = await client.createEmbedding(preparedText);
  return embedding;
};

export const generateQueryEmbedding = async (
  query: string,
  client: OpenAIEmbeddingClient = openaiService,
): Promise<number[]> => {
  const preparedQuery = query.trim();

  if (preparedQuery.length === 0) {
    throw new AppError("Search query is required", 400);
  }

  const { embedding } = await client.createEmbedding(preparedQuery);
  return embedding;
};

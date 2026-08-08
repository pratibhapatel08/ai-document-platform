import { MAX_EMBEDDING_INPUT_CHARS } from "../constants/embedding.constants";

export const prepareTextForEmbedding = (text: string): string => {
  const normalized = text.trim();

  if (normalized.length === 0) {
    return "";
  }

  if (normalized.length <= MAX_EMBEDDING_INPUT_CHARS) {
    return normalized;
  }

  return normalized.slice(0, MAX_EMBEDDING_INPUT_CHARS);
};

export const roundSimilarityScore = (score: number): number => {
  return Math.round(score * 100) / 100;
};

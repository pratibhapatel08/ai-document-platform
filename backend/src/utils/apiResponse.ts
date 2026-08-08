import type { Response } from "express";
import type { ApiSuccessResponse } from "../types/api";
import type { SemanticSearchApiResponse, SemanticSearchResult } from "../types/search.types";

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200,
): Response => {
  const payload: ApiSuccessResponse<T> = {
    success: true,
    message,
    ...(data !== undefined ? { data } : {}),
  };

  return res.status(statusCode).json(payload);
};

export const sendSearchResults = (
  res: Response,
  results: SemanticSearchResult[],
  statusCode = 200,
): Response => {
  const payload: SemanticSearchApiResponse = {
    success: true,
    results,
  };

  return res.status(statusCode).json(payload);
};

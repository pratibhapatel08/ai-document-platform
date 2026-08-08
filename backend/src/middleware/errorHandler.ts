import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";
import type { ApiErrorResponse } from "../types/api";

const isMongoDuplicateKeyError = (err: unknown): boolean => {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: unknown }).code === 11000
  );
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = 500;
  let message = "Internal server error";
  let errors: unknown;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errors = err.flatten();
  } else if (isMongoDuplicateKeyError(err)) {
    statusCode = 409;
    message = "Duplicate field value entered";
  } else if (err instanceof Error) {
    message = err.message;
  }

  if (env.NODE_ENV !== "production" && err instanceof Error) {
    console.error(err.stack);
  }

  const payload: ApiErrorResponse = {
    success: false,
    message,
    ...(errors !== undefined ? { errors } : {}),
  };

  res.status(statusCode).json(payload);
};

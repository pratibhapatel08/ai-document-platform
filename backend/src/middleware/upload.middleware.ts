import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import multer, { type MulterError } from "multer";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { AppError } from "../utils/AppError";
import { resolveFileType } from "../utils/textExtractor";

export const UPLOAD_DIR = path.join(process.cwd(), "uploads");
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const ensureUploadDir = (): void => {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
};

ensureUploadDir();

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    ensureUploadDir();
    callback(null, UPLOAD_DIR);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${extension}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, callback) => {
  const fileType = resolveFileType(file.mimetype);

  if (!fileType) {
    callback(new AppError("Only PDF and TXT files are allowed", 400));
    return;
  }

  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1,
  },
});

const handleMulterError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  const multerError = error as MulterError;

  if (multerError.code === "LIMIT_FILE_SIZE") {
    return new AppError("File size must not exceed 5 MB", 400);
  }

  if (multerError.code === "LIMIT_UNEXPECTED_FILE") {
    return new AppError('Unexpected field. Use "file" as the upload field name', 400);
  }

  if (error instanceof Error) {
    return new AppError(error.message, 400);
  }

  return new AppError("File upload failed", 400);
};

export const uploadSingle: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  upload.single("file")(req, res, (error: unknown) => {
    if (error) {
      next(handleMulterError(error));
      return;
    }

    next();
  });
};

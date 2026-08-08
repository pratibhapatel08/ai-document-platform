import type { Request, Response } from "express";
import {
  deleteDocumentById,
  getDocumentById,
  listDocuments,
  uploadDocument,
} from "../services/document.service";
import { searchDocumentsByQuery } from "../services/search.service";
import { sendSearchResults, sendSuccess } from "../utils/apiResponse";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import type {
  DocumentIdParams,
  ListDocumentsQuery,
  UploadDocumentInput,
} from "../validators/document.validator";
import type { SearchDocumentsQuery } from "../validators/search.validator";

export const uploadDocumentHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    if (!req.file) {
      throw new AppError("File is required", 400);
    }

    const input = req.body as UploadDocumentInput;

    const document = await uploadDocument({
      input,
      file: req.file,
      userId: req.user.id,
    });

    const message =
      document.processingStatus === "completed"
        ? "Document uploaded successfully"
        : "Document uploaded but processing failed";

    sendSuccess(res, message, { document }, 201);
  },
);

export const listDocumentsHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const query = req.query as unknown as ListDocumentsQuery;
    const isAdmin = req.user.role === "admin";

    const result = await listDocuments({
      userId: req.user.id,
      isAdmin,
      page: query.page,
      limit: query.limit,
      search: query.search,
    });

    sendSuccess(res, "Documents retrieved successfully", result);
  },
);

export const getDocumentHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const { id } = req.params as DocumentIdParams;
    const isAdmin = req.user.role === "admin";

    const document = await getDocumentById(id, req.user.id, isAdmin);

    sendSuccess(res, "Document retrieved successfully", { document });
  },
);

export const deleteDocumentHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const { id } = req.params as DocumentIdParams;
    const isAdmin = req.user.role === "admin";

    await deleteDocumentById(id, req.user.id, isAdmin);

    sendSuccess(res, "Document deleted successfully");
  },
);

export const searchDocumentsHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { q } = req.query as SearchDocumentsQuery;
    const results = await searchDocumentsByQuery(q);

    sendSearchResults(res, results);
  },
);

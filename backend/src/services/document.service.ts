import fs from "fs/promises";
import path from "path";
import { Document, type DocumentDocument } from "../models/Document.model";
import { UPLOAD_DIR } from "../middleware/upload.middleware";
import { generateDocumentEmbedding } from "./embedding.service";
import { generateDocumentSummary } from "./summary.service";
import { AppError } from "../utils/AppError";
import { toDocumentResponse } from "../utils/document.mapper";
import { toDocumentListItem } from "../utils/documentList.mapper";
import { extractTextFromFile, resolveFileType } from "../utils/textExtractor";
import type { DocumentResponse } from "../types/document.types";
import type { UploadedFile } from "../types/upload.types";
import type { UploadDocumentInput } from "../validators/document.validator";

interface UploadDocumentParams {
  input: UploadDocumentInput;
  file: UploadedFile;
  userId: string;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error occurred";
};

const removeUploadedFile = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath);
  } catch {
    // Ignore cleanup errors for orphaned files.
  }
};

const generateAndSaveSummaryWithEmbedding = async (
  document: DocumentDocument,
): Promise<DocumentResponse> => {
  document.processingStatus = "processing";
  document.processingError = null;
  await document.save();

  try {
    const { summary } = await generateDocumentSummary({
      extractedText: document.extractedText,
      title: document.title,
    });

    document.summary = summary;

    const embedding = await generateDocumentEmbedding(document.extractedText);
    document.embedding = embedding;
    document.processingStatus = "completed";
    document.processingError = null;
    await document.save();

    return toDocumentResponse(document);
  } catch (error) {
    document.processingStatus = "failed";
    document.processingError = getErrorMessage(error);
    await document.save();

    return toDocumentResponse(document);
  }
};

export const uploadDocument = async ({
  input,
  file,
  userId,
}: UploadDocumentParams): Promise<DocumentResponse> => {
  const filePath = path.join(file.destination ?? UPLOAD_DIR, file.filename);
  const fileType = resolveFileType(file.mimetype);

  if (!fileType) {
    await removeUploadedFile(filePath);
    throw new AppError("Only PDF and TXT files are allowed", 400);
  }

  const document = await Document.create({
    title: input.title,
    originalFileName: file.originalname,
    fileType,
    fileSize: file.size,
    extractedText: "",
    summary: "",
    embedding: [],
    uploadedBy: userId,
    processingStatus: "processing",
    processingError: null,
  });

  try {
    const extractedText = await extractTextFromFile(filePath, fileType);
    document.extractedText = extractedText;
    await document.save();

    return generateAndSaveSummaryWithEmbedding(document);
  } catch (error) {
    document.processingStatus = "failed";
    document.processingError = getErrorMessage(error);
    await document.save().catch(() => undefined);
    await removeUploadedFile(filePath);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Document processing failed", 500);
  }
};

export const refreshDocumentSummaryById = async (
  documentId: string,
): Promise<DocumentResponse> => {
  const document = await Document.findById(documentId);

  if (!document) {
    throw new AppError("Document not found", 404);
  }

  if (!document.extractedText.trim()) {
    throw new AppError("Document has no extracted text to summarize", 422);
  }

  return generateAndSaveSummaryWithEmbedding(document);
};

interface ListDocumentsParams {
  userId: string;
  isAdmin: boolean;
  page: number;
  limit: number;
  search?: string;
}

export const listDocuments = async ({
  userId,
  isAdmin,
  page,
  limit,
  search,
}: ListDocumentsParams) => {
  const filter: Record<string, unknown> = {};

  if (!isAdmin) {
    filter.uploadedBy = userId;
  }

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const skip = (page - 1) * limit;

  const [documents, total] = await Promise.all([
    Document.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-extractedText -embedding -summary"),
    Document.countDocuments(filter),
  ]);

  return {
    documents: documents.map((doc) => toDocumentListItem(doc)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getDocumentById = async (
  documentId: string,
  userId: string,
  isAdmin: boolean,
): Promise<DocumentResponse> => {
  const document = await Document.findById(documentId);

  if (!document) {
    throw new AppError("Document not found", 404);
  }

  if (!isAdmin && document.uploadedBy.toString() !== userId) {
    throw new AppError("You do not have permission to access this document", 403);
  }

  return toDocumentResponse(document);
};

export const deleteDocumentById = async (
  documentId: string,
  userId: string,
  isAdmin: boolean,
): Promise<void> => {
  const document = await Document.findById(documentId);

  if (!document) {
    throw new AppError("Document not found", 404);
  }

  if (!isAdmin && document.uploadedBy.toString() !== userId) {
    throw new AppError("You do not have permission to delete this document", 403);
  }

  await Document.findByIdAndDelete(documentId);
};

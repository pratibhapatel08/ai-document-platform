import fs from "fs/promises";
import { PDFParse } from "pdf-parse";
import { AppError } from "./AppError";
import type { DocumentFileType } from "../types/document.types";

const MIME_TO_FILE_TYPE: Record<string, DocumentFileType> = {
  "application/pdf": "pdf",
  "text/plain": "txt",
};

export const resolveFileType = (mimetype: string): DocumentFileType | null => {
  return MIME_TO_FILE_TYPE[mimetype] ?? null;
};

const extractPdfText = async (filePath: string): Promise<string> => {
  const buffer = await fs.readFile(filePath);
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    return result.text.trim();
  } finally {
    await parser.destroy();
  }
};

export const extractTextFromFile = async (
  filePath: string,
  fileType: DocumentFileType,
): Promise<string> => {
  try {
    if (fileType === "txt") {
      const text = await fs.readFile(filePath, "utf-8");
      return text.trim();
    }

    return await extractPdfText(filePath);
  } catch {
    throw new AppError("Failed to extract text from document", 422);
  }
};

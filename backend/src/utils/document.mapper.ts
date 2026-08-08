import type { Types } from "mongoose";

import type { DocumentResponse } from "../types/document.types";



interface DocumentLike {

  _id: { toString(): string };

  title: string;

  originalFileName: string;

  fileType: DocumentResponse["fileType"];

  fileSize: number;

  extractedText: string;

  summary: string;

  embedding: number[];

  uploadedBy: Types.ObjectId | string;

  processingStatus: DocumentResponse["processingStatus"];

  processingError: string | null;

  createdAt: Date;

  updatedAt: Date;

}



export const toDocumentResponse = (document: DocumentLike): DocumentResponse => ({

  id: document._id.toString(),

  title: document.title,

  originalFileName: document.originalFileName,

  fileType: document.fileType,

  fileSize: document.fileSize,

  extractedText: document.extractedText,

  summary: document.summary,

  embedding: document.embedding,

  uploadedBy:

    typeof document.uploadedBy === "string"

      ? document.uploadedBy

      : document.uploadedBy.toString(),

  processingStatus: document.processingStatus,

  processingError: document.processingError ?? null,

  createdAt: document.createdAt,

  updatedAt: document.updatedAt,

});



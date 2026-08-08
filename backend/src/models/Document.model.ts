import mongoose, { Schema, type HydratedDocument, type Model, type Types } from "mongoose";

import type { DocumentFileType, ProcessingStatus } from "../types/document.types";



export interface IDocument {

  title: string;

  originalFileName: string;

  fileType: DocumentFileType;

  fileSize: number;

  extractedText: string;

  summary: string;

  embedding: number[];

  uploadedBy: Types.ObjectId;

  processingStatus: ProcessingStatus;

  processingError: string | null;

  createdAt: Date;

  updatedAt: Date;

}



export type DocumentDocument = HydratedDocument<IDocument>;

export type DocumentModel = Model<IDocument>;



const documentSchema = new Schema<IDocument, DocumentModel>(

  {

    title: {

      type: String,

      required: [true, "Title is required"],

      trim: true,

      maxlength: [200, "Title must be at most 200 characters"],

    },

    originalFileName: {

      type: String,

      required: [true, "Original file name is required"],

      trim: true,

    },

    fileType: {

      type: String,

      enum: ["pdf", "txt"],

      required: [true, "File type is required"],

    },

    fileSize: {

      type: Number,

      required: [true, "File size is required"],

      min: [1, "File size must be greater than 0"],

    },

    extractedText: {

      type: String,

      default: "",

    },

    summary: {

      type: String,

      default: "",

    },

    embedding: {

      type: [Number],

      default: [],

    },

    uploadedBy: {

      type: Schema.Types.ObjectId,

      ref: "User",

      required: [true, "Uploader is required"],

      index: true,

    },

    processingStatus: {

      type: String,

      enum: ["processing", "completed", "failed"],

      default: "processing",

    },

    processingError: {

      type: String,

      default: null,

    },

  },

  {

    timestamps: true,

    versionKey: false,

  },

);



export const Document = mongoose.model<IDocument, DocumentModel>("Document", documentSchema);



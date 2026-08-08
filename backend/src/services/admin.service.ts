import { Document } from "../models/Document.model";
import { User } from "../models/User.model";
import type {
  AdminDashboardStats,
  AdminDocumentListItem,
  PaginatedAdminDocumentsResult,
} from "../types/admin.types";
import type { ProcessingStatus } from "../types/document.types";

interface ListAdminDocumentsParams {
  page: number;
  limit: number;
  status: ProcessingStatus | "all";
}

export const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  const [totalUsers, totalDocuments, processingDocuments, failedDocuments, completedDocuments] =
    await Promise.all([
      User.countDocuments(),
      Document.countDocuments(),
      Document.countDocuments({ processingStatus: "processing" }),
      Document.countDocuments({ processingStatus: "failed" }),
      Document.countDocuments({ processingStatus: "completed" }),
    ]);

  return {
    totalUsers,
    totalDocuments,
    processingDocuments,
    failedDocuments,
    completedDocuments,
  };
};

export const listAdminDocuments = async ({
  page,
  limit,
  status,
}: ListAdminDocumentsParams): Promise<PaginatedAdminDocumentsResult> => {
  const filter: Record<string, unknown> = {};

  if (status !== "all") {
    filter.processingStatus = status;
  }

  const skip = (page - 1) * limit;

  const [documents, total] = await Promise.all([
    Document.find(filter)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-extractedText -embedding -summary"),
    Document.countDocuments(filter),
  ]);

  const mappedDocuments: AdminDocumentListItem[] = documents.map((document) => {
    const uploader = document.uploadedBy as unknown as { _id: { toString(): string }; name: string };

    return {
      id: document._id.toString(),
      title: document.title,
      originalFileName: document.originalFileName,
      fileType: document.fileType,
      fileSize: document.fileSize,
      uploadedBy: uploader?._id?.toString?.() ?? String(document.uploadedBy),
      uploadedByName: uploader?.name ?? "Unknown",
      processingStatus: document.processingStatus,
      processingError: document.processingError ?? null,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  });

  return {
    documents: mappedDocuments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

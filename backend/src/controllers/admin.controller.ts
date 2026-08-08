import type { Request, Response } from "express";
import { refreshDocumentSummaryById } from "../services/document.service";
import { getAdminDashboardStats, listAdminDocuments } from "../services/admin.service";
import { sendSuccess } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import type {
  DocumentIdParams,
  ListAdminDocumentsQuery,
} from "../validators/admin.validator";

export const getAdminDashboardHandler = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const stats = await getAdminDashboardStats();
    sendSuccess(res, "Admin dashboard stats retrieved successfully", { stats });
  },
);

export const listAdminDocumentsHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as ListAdminDocumentsQuery;

    const result = await listAdminDocuments({
      page: query.page,
      limit: query.limit,
      status: query.status,
    });

    sendSuccess(res, "Admin documents retrieved successfully", result);
  },
);

export const refreshSummary = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as DocumentIdParams;

  const document = await refreshDocumentSummaryById(id);

  const message =
    document.processingStatus === "completed"
      ? "Summary regenerated successfully"
      : "Summary regeneration failed";

  sendSuccess(res, message, { document });
});

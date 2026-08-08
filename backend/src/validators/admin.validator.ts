import { z } from "zod";
import { PROCESSING_STATUSES } from "../types/document.types";

export const documentIdParamsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid document ID"),
});

export const listAdminDocumentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  status: z.enum(["all", ...PROCESSING_STATUSES]).default("all"),
});

export type DocumentIdParams = z.infer<typeof documentIdParamsSchema>;
export type ListAdminDocumentsQuery = z.infer<typeof listAdminDocumentsQuerySchema>;

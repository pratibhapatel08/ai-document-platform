import { z } from "zod";

export const searchDocumentsQuerySchema = z.object({
  q: z
    .string()
    .trim()
    .min(1, "Search query is required")
    .max(500, "Search query must be at most 500 characters"),
});

export type SearchDocumentsQuery = z.infer<typeof searchDocumentsQuerySchema>;

export {
  loginSchema,
  registerSchema,
} from "./auth.validator";
export type { LoginInput, RegisterInput } from "./auth.validator";
export { uploadDocumentSchema } from "./document.validator";
export type { UploadDocumentInput } from "./document.validator";
export { documentIdParamsSchema } from "./admin.validator";
export type { DocumentIdParams } from "./admin.validator";
export { searchDocumentsQuerySchema } from "./search.validator";
export type { SearchDocumentsQuery } from "./search.validator";

import { Router } from "express";
import {
  deleteDocumentHandler,
  getDocumentHandler,
  listDocumentsHandler,
  searchDocumentsHandler,
  uploadDocumentHandler,
} from "../controllers/document.controller";
import { authenticate } from "../middleware/authenticate";
import { uploadSingle } from "../middleware/upload.middleware";
import { validateBody, validateParams, validateQuery } from "../middleware/validate";
import {
  documentIdParamsSchema,
  listDocumentsQuerySchema,
  uploadDocumentSchema,
} from "../validators/document.validator";
import { searchDocumentsQuerySchema } from "../validators/search.validator";

const documentRouter = Router();

documentRouter.get(
  "/search",
  authenticate,
  validateQuery(searchDocumentsQuerySchema),
  searchDocumentsHandler,
);

documentRouter.post(
  "/upload",
  authenticate,
  uploadSingle,
  validateBody(uploadDocumentSchema),
  uploadDocumentHandler,
);

documentRouter.get(
  "/",
  authenticate,
  validateQuery(listDocumentsQuerySchema),
  listDocumentsHandler,
);

documentRouter.get(
  "/:id",
  authenticate,
  validateParams(documentIdParamsSchema),
  getDocumentHandler,
);

documentRouter.delete(
  "/:id",
  authenticate,
  validateParams(documentIdParamsSchema),
  deleteDocumentHandler,
);

export default documentRouter;

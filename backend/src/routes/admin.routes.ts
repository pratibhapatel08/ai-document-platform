import { Router } from "express";
import {
  getAdminDashboardHandler,
  listAdminDocumentsHandler,
  refreshSummary,
} from "../controllers/admin.controller";
import { authenticate } from "../middleware/authenticate";
import { allowRoles } from "../middleware/authorize";
import { validateParams, validateQuery } from "../middleware/validate";
import {
  documentIdParamsSchema,
  listAdminDocumentsQuerySchema,
} from "../validators/admin.validator";

const adminRouter = Router();

adminRouter.use(authenticate, allowRoles("admin"));

adminRouter.get("/dashboard", getAdminDashboardHandler);

adminRouter.get(
  "/documents",
  validateQuery(listAdminDocumentsQuerySchema),
  listAdminDocumentsHandler,
);

adminRouter.post(
  "/refresh-summary/:id",
  validateParams(documentIdParamsSchema),
  refreshSummary,
);

export default adminRouter;

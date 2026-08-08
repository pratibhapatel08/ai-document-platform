import { Router } from "express";
import healthRouter from "./health.routes";
import authRouter from "./auth.routes";
import documentRouter from "./document.routes";
import adminRouter from "./admin.routes";

const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/documents", documentRouter);
apiRouter.use("/admin", adminRouter);

export default apiRouter;

import { Router } from "express";
import { getProfile, login, register } from "../controllers/auth.controller";
import { authenticate } from "../middleware/authenticate";
import { authRateLimiter } from "../middleware/rateLimiter";
import { validateBody } from "../middleware/validate";
import { loginSchema, registerSchema } from "../validators/auth.validator";

const authRouter = Router();

authRouter.post("/register", authRateLimiter, validateBody(registerSchema), register);
authRouter.post("/login", authRateLimiter, validateBody(loginSchema), login);
authRouter.get("/profile", authenticate, getProfile);

export default authRouter;

import type { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse";

export const getHealth = (_req: Request, res: Response): void => {
  sendSuccess(res, "Server is running");
};

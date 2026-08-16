import { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "../error/AppError";

export const validateSchema = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join(",");
      return next(new AppError(400, message));
    }
    req.body = result;
    next();
  };
};

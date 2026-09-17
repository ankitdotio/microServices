import { NextFunction, Request, Response } from "express";
import { AppError } from "../error/AppError";
/**
 *
 * - reads GATEWAY_SECRET from .env
 * - compares to x-gateway-secret
 * - match -> next() ; mismatch ->403
 */
export const requireGatewaySecret = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const expected = process.env.GATEWAY_SECRETS;
  console.log(expected);
  if (!expected) {
    throw new AppError(500, "GATEWAY_SECRET NOT SET IN .ENV ");
  }
  const incoming = req.header("x-gateway-secret");

  if (!incoming || incoming !== expected) {
    throw new AppError(403, "FORBIDDEN");
  }
  next();
};

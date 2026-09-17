import { NextFunction, Request, Response } from "express";
import { AppError, verifyToken } from "shared";
import { getAllowedRoles, isPublicRoute, publicRoutes } from "../rbac";
import { verify } from "node:crypto";

//striping secrets
const IdentityHeaders = [
  "x-user-id",
  "x-user-role",
  "x-gateway-secret",
] as const;

const stripIdentityHeaders = (req: Request) => {
  for (const header of IdentityHeaders) {
    delete req.headers[header];
  }
};

//attaching gateway secret
const attachGatewaySecret = (req: Request) => {
  const secret = process.env.GATEWAY_SECRETS;

  if (!secret) {
    throw new AppError(500, "GATEWAY_SECRET IS NOT SET/ CONFIGURED/ MISSING");
  }
  req.headers["x-gateway-secret"] = secret;
};

const requestPath = (req: Request) => {
  const combined = `${req.baseUrl}${req.path}`;
  if (combined.length > 1 && combined.endsWith("/")) {
    return combined.slice(0, -1);
  }
  return combined || "/";
};

const attachUserHeader = (req: Request, userId: string, role: string) => {
  req.headers["x-user-id"] = userId;
  req.headers["x-user-role"] = role;
};

/**
 *  - main middleware
 *  - runs on every /auth request before proxy forward to auth service
 */

export const gatewayAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // strip identity headers
    stripIdentityHeaders(req);

    //attaching secret
    attachGatewaySecret(req);

    //extracting path
    const path = requestPath(req);

    //check for public route
    if (isPublicRoute(req.method, path)) {
      return next();
    }

    //check for authorization header
    const authHeader = req.headers["authorization"];

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(401, "MISSING OR INVALID TOKEN");
    }

    //extracting token
    const token = authHeader.slice("Bearer ".length).trim();
    const payload = verifyToken(token);

    //RBAC
    const allowedRole = getAllowedRoles(req.method, path);
    if (!allowedRole) {
      throw new AppError(404, "ROUTE NOT FOUND gatewayauth");
    }

    //forbidden
    if (!allowedRole.includes(payload.role)) {
      throw new AppError(403, "FORBIDDEN");
    }

    //attaching header

    attachUserHeader(req, payload.userId, payload.role);
    next();
  } catch (error) {
    console.error("GATEWAY AUTH ERROR:", error);
    if (error instanceof AppError) {
      return next(error);

      //in some case jwt fails
    }
    return next(new AppError(401, "INVALID OR EXPIRED TOKEN"));
  }
};

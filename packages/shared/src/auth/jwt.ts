import jwt from "jsonwebtoken";
import type { JwtPayload } from "./types";

const extractSecrets = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT SECRET NOT SET IN .ENV");
  }
  return secret;
};

export const signToken = (payload: JwtPayload): string => {
  const expiresIn = process.env.JWT_EXPIRES_IN;

  if (!expiresIn) {
    throw new Error("JWT EXPIRES IN NOT SET IN .ENV");
  }

  return jwt.sign(payload, extractSecrets(), {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string): JwtPayload => {
  const decodedToken = jwt.verify(token, extractSecrets());

  if (
    typeof decodedToken !== "object" ||
    decodedToken === null ||
    typeof decodedToken.userId !== "string" ||
    decodedToken.role !== "USER" ||
    decodedToken.role !== "ADMIN"
  ) {
    throw new Error("INVALID PAYLOAD");
  }
  return {
    userId: decodedToken.userID,
    role: decodedToken.role,
  };
};

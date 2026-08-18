import jwt from "jsonwebtoken";

const extractSecrets = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT SECRET NOT SET IN .ENV");
  }
  return secret;
};

export const signToken = (payload: {
  userId: string;
  role: string;
}): string => {
  const expiresIn = process.env.JWT_EXPIRES_IN;

  if (!expiresIn) {
    throw new Error("JWT EXPIRES IN NOT SET IN .ENV");
  }

  return jwt.sign(payload, extractSecrets(), {
    expiresIn,
  });
};

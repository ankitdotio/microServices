import {
  createUser,
  findByEmail,
  findById,
} from "../repositories/auth.repositories";
import { loginInput, registerInput } from "../schema/auth.schemas";
import bcrypt from "bcryptjs";
import { convertToPublicUser } from "../utils/auth.util";
import { AppError, getPool } from "shared";
import { signToken } from "shared";

export const registerService = async (input: registerInput) => {
  const existingUser = await findByEmail(input.email);

  if (!existingUser) {
    const password_hash = await bcrypt.hash(input.password, 10);
    console.log(input.password);
    const User = await createUser({
      name: input.name,
      email: input.email,
      password_hash,
      role: "USER",
    });

    return convertToPublicUser(User);
  }
  throw new AppError(401, "USER ALREADY EXISTS");
};

export const loginService = async (input: loginInput) => {
  const User = await findByEmail(input.email);
  if (!User) {
    throw new AppError(401, "EITHER PASSWORD OR EMAIL IS INVALID");
  }

  const isValid = await bcrypt.compare(input.password, User.password_hash);

  if (!isValid) {
    throw new AppError(401, "EITHER PASSWORD OR EMAIL IS INVALID");
  }

  const token = signToken({
    userId: User.id,
    role: User.role,
  });

  return {
    token,
    user: convertToPublicUser(User),
  };
};

export const getmeService = async (userId: string) => {
  const user = await findById(userId);
  if (!user) {
    throw new AppError(404, "USER NOT FOUND");
  }
  return convertToPublicUser(user);
};

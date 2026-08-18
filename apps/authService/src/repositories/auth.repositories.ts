import { getPool } from "../../../../packages/shared/src/db/pool";
import { User, UserRole } from "../types/auth.types";

export const createUser = async (input: {
  name: string;
  email: string;
  password_hash: string;
  role?: UserRole;
}): Promise<User> => {
  const result = await getPool().query<User>(
    `
    INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,$4)
    RETURNING id,email,password_hash,role,createdAt
    `,
    [input.name, input.email, input.password_hash, input.role ?? "USER"],
  );
  return result.rows[0];
};

export const findByEmail = async (email: string): Promise<User | null> => {
  const user = await getPool().query(
    `
    SELECT * FROM users WHERE email = $1
    `,
    [email],
  );
  return user.rows[0] ?? null;
};

export const findById = async (userId: string): Promise<User | null> => {
  const user = await getPool().query<User>(
    `
    SELECT * FROM users WHERE id = $1
    `,
    [userId],
  );

  return user.rows[0] ?? null;
};

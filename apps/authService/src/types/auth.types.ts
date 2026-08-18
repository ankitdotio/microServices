export type UserRole = "USER" | "ADMIN";

export type User = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  createdAt: Date;
};

export type Payload = {
  userId: string;
  role: UserRole;
};

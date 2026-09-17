import type { UserRole } from "shared";

export type RbacRules = {
  method: string;
  path: string;
  role: UserRole[];
};

export const publicRoutes = [
  {
    method: "POST",
    path: "/auth/register",
  },
  {
    method: "POST",
    path: "/auth/login",
  },
] as const;

const rbacRules: RbacRules[] = [
  {
    method: "GET",
    path: "/auth/me",
    role: ["ADMIN", "USER"],
  },
  {
    method: "POST",
    path: "/tasks",
    role: ["ADMIN", "USER"],
  },
  {
    method: "GET",
    path: "/tasks",
    role: ["ADMIN", "USER"],
  },
  {
    method: "GET",
    path: "tasks/:taskId",
    role: ["ADMIN", "USER"],
  },
  {
    method: "DELETE",
    path: "tasks/:taskId",
    role: ["ADMIN"],
  },
  {
    method: "POST",
    path: "/tasks/:taskId/attachments",
    role: ["USER", "ADMIN"],
  },
  {
    method: "GET",
    path: "/tasks/:taskId/attachments",
    role: ["USER", "ADMIN"],
  },
];

const matchpath = (pattern: string, actual: string): boolean => {
  if (pattern === actual) {
    return true;
  }

  const patternParts = pattern.split("/");
  const actualParts = actual.split("/");

  if (patternParts.length !== actualParts.length) {
    return false;
  }

  return patternParts.every(
    (part, index) => part.startsWith(":") || part === actualParts[index],
  );
};

export const isPublicRoute = (method: string, path: string): boolean => {
  return publicRoutes.some(
    (route) => route.method === method && matchpath(route.path, path),
  );
};

export const getAllowedRoles = (
  method: string,
  path: string,
): UserRole[] | null => {
  const rule = rbacRules.find(
    (currentItem) =>
      currentItem.method === method && matchpath(currentItem.path, path),
  );

  return rule?.role ?? null;
};

import type { User } from "@/payload-types";
import { APIError } from "payload";
import type { CollectionBeforeChangeHook } from "payload";

type UserWithRole = User & {
  role?: "developer" | "admin";
};

export const protectRoles: CollectionBeforeChangeHook<User> = ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (!req.user) {
    return data;
  }

  const currentUser = req.user as UserWithRole;

  // Check if admin is trying to create a user with developer role
  if (operation === "create" && currentUser.role === "admin") {
    if (data.role === "developer") {
      throw new APIError("Admins cannot create users with developer role", 403);
    }
  }

  // Only check role changes on update operations
  if (operation !== "update" || !originalDoc) {
    return data;
  }

  const originalUser = originalDoc as UserWithRole;

  // Check if admin is trying to set any user's role to developer
  if (currentUser.role === "admin" && data.role === "developer") {
    throw new APIError("Admins cannot change user roles to developer", 403);
  }

  // Check if developer is trying to change their own role to admin
  if (
    currentUser.role === "developer" &&
    String(currentUser.id) === String(originalUser.id) &&
    data.role === "admin" &&
    originalUser.role === "developer"
  ) {
    throw new APIError("Developers cannot change their own role to admin", 403);
  }

  return data;
};

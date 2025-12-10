import type { User } from "@/payload-types";
import type { Access } from "payload";

type UserWithRole = User & {
  role?: "developer" | "admin";
};

export const userDelete: Access<User> = async ({ req, id }) => {
  if (!req.user) {
    return false;
  }

  const currentUser = req.user as UserWithRole;

  // Cannot delete yourself
  if (id && String(id) === String(currentUser.id)) {
    return false;
  }

  if (!id) {
    return false;
  }

  // Fetch the user being deleted
  const userToDelete = (await req.payload.findByID({
    collection: "users",
    id: String(id),
  })) as UserWithRole;

  // Developer has full control - can delete anyone (except themselves)
  if (currentUser.role === "developer") {
    return true;
  }

  // Admin cannot delete developer users
  if (currentUser.role === "admin" && userToDelete.role === "developer") {
    return false;
  }

  // Admin can delete other admins
  return true;
};

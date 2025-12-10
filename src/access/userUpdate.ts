import type { User } from "@/payload-types";
import type { Access } from "payload";

type UserWithRole = User & {
  role?: "developer" | "admin";
};

export const userUpdate: Access<User> = async ({ req, id }) => {
  if (!req.user) {
    return false;
  }

  const currentUser = req.user as UserWithRole;

  // If updating self, allow it
  if (id && String(id) === String(currentUser.id)) {
    return true;
  }

  // If no ID provided (creating new user), allow authenticated users
  if (!id) {
    return true;
  }

  // Fetch the user being updated
  const userToUpdate = (await req.payload.findByID({
    collection: "users",
    id: String(id),
  })) as UserWithRole;

  // Developer has full control - can update anyone
  if (currentUser.role === "developer") {
    return true;
  }

  // Admin cannot update developer users
  if (currentUser.role === "admin" && userToUpdate.role === "developer") {
    return false;
  }

  // Admin can update other admins
  return true;
};

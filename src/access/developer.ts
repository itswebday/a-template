import type { User } from "@/payload-types";
import type { AccessArgs } from "payload";

type isDeveloper = (args: AccessArgs<User>) => boolean;

export const developer: isDeveloper = ({ req }) => {
  if (!req.user) {
    return false;
  }

  const user = req.user as User & {
    role?: "developer" | "admin";
  };

  return user.role === "developer";
};

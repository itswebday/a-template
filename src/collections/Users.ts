import { authenticated, userDelete, userUpdate } from "@/access";
import { protectRoles } from "@/hooks";
import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "role"],
    group: "General",
  },
  access: {
    create: authenticated,
    delete: userDelete,
    read: authenticated,
    update: userUpdate,
  },
  auth: true,
  fields: [
    {
      name: "role",
      label: "Role",
      type: "select",
      defaultValue: "admin",
      options: [
        {
          label: "Developer",
          value: "developer",
        },
        {
          label: "Admin",
          value: "admin",
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [protectRoles],
  },
};

import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email"],
    group: "Database",
  },
  auth: true,
  fields: [],
};

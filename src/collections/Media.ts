import { anyone, authenticated } from "@/access";
import path from "path";
import type { CollectionConfig } from "payload";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: "Database",
    useAsTitle: "alt",
    defaultColumns: ["alt", "createdAt"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, "../../public/media"),
    adminThumbnail: "thumbnail",
    focalPoint: true,
    imageSizes: [
      {
        name: "small",
        width: 550,
      },
      {
        name: "medium",
        width: 900,
      },
      {
        name: "large",
        width: 2000,
      },
      {
        name: "openGraph",
        width: 1200,
        height: 630,
        crop: "center",
      },
    ],
  },
};

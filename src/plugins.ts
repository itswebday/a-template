import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { Plugin } from "payload";

export const plugins: Plugin[] = [
  vercelBlobStorage({
    collections: {
      media: true,
    },
    token: process.env.BLOB_READ_WRITE_TOKEN || "",
  }),
];

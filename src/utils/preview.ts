import { PREVIEW_URL } from "@/constants";
import type { CollectionSlug } from "payload";

export const getPreviewPathGlobal = async ({
  global,
  data,
}: {
  global: string;
  data?: Record<string, unknown>;
}) => {
  if (!data || typeof data !== "object" || !("url" in data) || !data.url) {
    return null;
  }

  if (!data.url || typeof data.url !== "string") {
    return null;
  }

  const encodedParams = new URLSearchParams({
    global: global,
    path: data.url,
    previewSecret: process.env.PREVIEW_SECRET || "",
  });

  return `${PREVIEW_URL}?${encodedParams.toString()}`;
};

export const getPreviewPathCollection = ({
  collection,
  url,
}: {
  collection: CollectionSlug;
  url: string;
}) => {
  if (!url) {
    return null;
  }

  if (!url || typeof url !== "string") {
    return null;
  }

  const encodedParams = new URLSearchParams({
    collection: collection,
    url: url,
    path: url,
    previewSecret: process.env.PREVIEW_SECRET || "",
  });

  return `${PREVIEW_URL}?${encodedParams.toString()}`;
};

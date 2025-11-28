import { PREVIEW_URL } from "@/constants";
import type { PayloadRequest } from "payload";

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

  const urlValue = Array.isArray(data.url) ? data.url[0] : data.url;
  if (!urlValue || typeof urlValue !== "string") {
    return null;
  }

  const path = urlValue;

  const encodedParams = new URLSearchParams({
    global: global,
    path: path,
    previewSecret: process.env.PREVIEW_SECRET || "",
  });

  return `${PREVIEW_URL}?${encodedParams.toString()}`;
};

export const getPreviewPathCollection = ({
  req,
  collection,
  url,
}: {
  req: PayloadRequest;
  collection: "pages" | "blog-posts";
  url: string | string[];
}) => {
  if (url === undefined || url === null) {
    return null;
  }

  const urlValue = Array.isArray(url) ? url[0] : url;
  if (urlValue === null || !urlValue || typeof urlValue !== "string") {
    return null;
  }

  // The URL from the collection already includes the locale prefix and /blog for blog posts
  const path = urlValue;

  const encodedParams = new URLSearchParams({
    collection: collection,
    url: urlValue,
    path: path,
    previewSecret: process.env.PREVIEW_SECRET || "",
  });

  return `${PREVIEW_URL}?${encodedParams.toString()}`;
};

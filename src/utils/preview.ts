import { DEFAULT_LOCALE, PREVIEW_URL } from "@/constants";
import { PayloadRequest } from "payload";

export const getPreviewPathGlobal = async ({
  req,
  global,
}: {
  req: PayloadRequest;
  global: string;
}) => {
  const locale = req?.locale || DEFAULT_LOCALE;
  let basePath = "/";

  if (global === "blog") {
    basePath = "/blog";
  }

  const path = locale === DEFAULT_LOCALE ? basePath : `/${locale}${basePath}`;
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

  const locale = req?.locale || DEFAULT_LOCALE;
  const urlValue = Array.isArray(url) ? url[0] : url;
  let basePath = urlValue === null || !urlValue ? "/" : urlValue;

  if (collection === "blog-posts" && basePath !== "/") {
    basePath = `/blog${basePath}`;
  }

  const path = locale === DEFAULT_LOCALE ? basePath : `/${locale}${basePath}`;
  const encodedParams = new URLSearchParams({
    collection: collection,
    url: urlValue,
    path: path,
    previewSecret: process.env.PREVIEW_SECRET || "",
  });

  return `${PREVIEW_URL}?${encodedParams.toString()}`;
};

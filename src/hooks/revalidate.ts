"use server";

import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import type { Page } from "@/payload-types";
import { revalidatePath } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  TypeWithID,
} from "payload";

type BlogPost = TypeWithID & {
  _status?: "draft" | "published" | null;
  url?: string | string[] | null;
  slug?: string | string[] | null;
};

const extractBasePath = (
  url: string | string[] | null | undefined,
): string | null => {
  if (!url || typeof url !== "string") {
    return null;
  }

  for (const locale of LOCALES) {
    if (locale !== DEFAULT_LOCALE && url.startsWith(`/${locale}/`)) {
      return url.slice(`/${locale}`.length);
    } else if (locale !== DEFAULT_LOCALE && url === `/${locale}`) {
      return "/";
    }
  }

  return url;
};

const generateLocalizedPaths = (basePath: string): string[] => {
  return [
    basePath,
    ...LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).map(
      (locale) => `/${locale}${basePath === "/" ? "" : basePath}`,
    ),
  ];
};

const createGlobalRevalidateHook = (): GlobalAfterChangeHook => {
  return ({ doc, previousDoc, req: { context } }) => {
    if (!context.disableRevalidate) {
      const docUrl =
        typeof doc === "object" && doc !== null && "url" in doc && doc.url
          ? doc.url
          : null;

      if (docUrl && typeof docUrl === "string") {
        const basePath = extractBasePath(docUrl);
        if (basePath) {
          const paths = generateLocalizedPaths(basePath);

          if (doc._status === "published") {
            paths.forEach((path) => {
              revalidatePath(path);
            });
          }

          if (
            previousDoc?._status === "published" &&
            doc._status !== "published"
          ) {
            paths.forEach((path) => {
              revalidatePath(path);
            });
          }
        }
      }
    }
    return doc;
  };
};

const createCollectionRevalidateHook = <
  T extends TypeWithID & {
    url?: string | string[] | null;
    _status?: "draft" | "published" | null;
  },
>(
  getAdditionalPaths?: (url: string | null) => string[],
): CollectionAfterChangeHook<T> => {
  return ({ doc, previousDoc, req: { context } }) => {
    if (!context.disableRevalidate) {
      if (doc._status === "published") {
        if (doc.url && typeof doc.url === "string") {
          const basePath = extractBasePath(doc.url);

          if (basePath) {
            const paths = generateLocalizedPaths(basePath);

            paths.forEach((path) => {
              revalidatePath(path);
            });
          } else {
            revalidatePath(doc.url);
          }

          if (getAdditionalPaths) {
            const additionalPaths = getAdditionalPaths(doc.url);

            additionalPaths.forEach((additionalPath) => {
              revalidatePath(additionalPath);
            });
          }
        }
      }

      if (previousDoc?._status === "published" && doc._status !== "published") {
        if (previousDoc.url && typeof previousDoc.url === "string") {
          const basePath = extractBasePath(previousDoc.url);
          if (basePath) {
            const paths = generateLocalizedPaths(basePath);
            paths.forEach((path) => {
              revalidatePath(path);
            });
          } else {
            revalidatePath(previousDoc.url);
          }

          if (getAdditionalPaths) {
            const additionalPaths = getAdditionalPaths(previousDoc.url);

            additionalPaths.forEach((additionalPath) => {
              revalidatePath(additionalPath);
            });
          }
        }
      }
    }
    return doc;
  };
};

const createCollectionDeleteHook = <
  T extends TypeWithID & { url?: string | string[] | null },
>(
  getAdditionalPaths?: (url: string | null) => string[],
): CollectionAfterDeleteHook<T> => {
  return ({ doc, req: { context } }) => {
    if (!context.disableRevalidate) {
      if (doc?.url && typeof doc?.url === "string") {
        const basePath = extractBasePath(doc.url);
        if (basePath) {
          const paths = generateLocalizedPaths(basePath);
          paths.forEach((path) => {
            revalidatePath(path);
          });
        } else {
          revalidatePath(doc.url);
        }

        if (getAdditionalPaths) {
          const additionalPaths = getAdditionalPaths(doc.url);
          additionalPaths.forEach((additionalPath) => {
            revalidatePath(additionalPath);
          });
        }
      }
    }
    return doc;
  };
};

export const revalidateHomepage = createGlobalRevalidateHook();
export const revalidateBlog = createGlobalRevalidateHook();
export const revalidatePrivacyPolicy = createGlobalRevalidateHook();
export const revalidateCookiePolicy = createGlobalRevalidateHook();
export const revalidateTermsAndConditions = createGlobalRevalidateHook();

const getBlogListingPaths = (url: string | null): string[] => {
  if (!url) {
    return [];
  }

  const basePath = extractBasePath(url);

  if (!basePath || !basePath.startsWith("/blog")) {
    return [];
  }

  return generateLocalizedPaths("/blog");
};

export const revalidatePage: CollectionAfterChangeHook<Page> =
  createCollectionRevalidateHook<Page>();

export const revalidateDelete: CollectionAfterDeleteHook<Page> =
  createCollectionDeleteHook<Page>();

export const revalidateBlogPost: CollectionAfterChangeHook<BlogPost> =
  createCollectionRevalidateHook<BlogPost>(getBlogListingPaths);

export const revalidateBlogPostDelete: CollectionAfterDeleteHook<BlogPost> =
  createCollectionDeleteHook<BlogPost>(getBlogListingPaths);

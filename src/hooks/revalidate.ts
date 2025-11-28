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

// Extract base path from URL (remove locale prefix)
const extractBasePath = (
  url: string | string[] | null | undefined,
): string | null => {
  if (!url) return null;
  const urlValue = Array.isArray(url) ? url[0] : url;
  if (!urlValue || typeof urlValue !== "string") return null;

  // Check if URL starts with a locale prefix
  for (const locale of LOCALES) {
    if (locale !== DEFAULT_LOCALE && urlValue.startsWith(`/${locale}/`)) {
      return urlValue.slice(`/${locale}`.length);
    } else if (locale !== DEFAULT_LOCALE && urlValue === `/${locale}`) {
      return "/";
    }
  }

  return urlValue;
};

// Generate all locale versions of a path
const generateLocalizedPaths = (basePath: string): string[] => {
  return [
    basePath,
    ...LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).map(
      (locale) => `/${locale}${basePath === "/" ? "" : basePath}`,
    ),
  ];
};

// Generic function to create global revalidation hooks
const createGlobalRevalidateHook = (): GlobalAfterChangeHook => {
  return ({ doc, previousDoc, req: { context } }) => {
    if (!context.disableRevalidate) {
      // Extract URL from doc
      const docUrl =
        typeof doc === "object" && doc !== null && "url" in doc && doc.url
          ? Array.isArray(doc.url)
            ? doc.url[0]
            : doc.url
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

// Generic function to create collection revalidation hooks
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
        const url = Array.isArray(doc.url) ? doc.url[0] : doc.url;
        if (url && typeof url === "string") {
          // Extract base path and generate all locale versions
          const basePath = extractBasePath(url);
          if (basePath) {
            const paths = generateLocalizedPaths(basePath);
            paths.forEach((path) => {
              revalidatePath(path);
            });
          } else {
            // Fallback: revalidate the specific URL if base path extraction fails
            revalidatePath(url);
          }

          if (getAdditionalPaths) {
            const additionalPaths = getAdditionalPaths(url);
            additionalPaths.forEach((additionalPath) => {
              revalidatePath(additionalPath);
            });
          }
        }
      }

      if (previousDoc?._status === "published" && doc._status !== "published") {
        const oldUrl = Array.isArray(previousDoc.url)
          ? previousDoc.url[0]
          : previousDoc.url;
        if (oldUrl && typeof oldUrl === "string") {
          // Extract base path and generate all locale versions
          const basePath = extractBasePath(oldUrl);
          if (basePath) {
            const paths = generateLocalizedPaths(basePath);
            paths.forEach((path) => {
              revalidatePath(path);
            });
          } else {
            // Fallback: revalidate the specific URL if base path extraction fails
            revalidatePath(oldUrl);
          }

          if (getAdditionalPaths) {
            const additionalPaths = getAdditionalPaths(oldUrl);
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

// Generic function to create collection delete hooks
const createCollectionDeleteHook = <
  T extends TypeWithID & { url?: string | string[] | null },
>(
  getAdditionalPaths?: (url: string | null) => string[],
): CollectionAfterDeleteHook<T> => {
  return ({ doc, req: { context } }) => {
    if (!context.disableRevalidate) {
      const url = Array.isArray(doc?.url) ? doc?.url[0] : doc?.url;
      if (url && typeof url === "string") {
        // Extract base path and generate all locale versions
        const basePath = extractBasePath(url);
        if (basePath) {
          const paths = generateLocalizedPaths(basePath);
          paths.forEach((path) => {
            revalidatePath(path);
          });
        } else {
          // Fallback: revalidate the specific URL if base path extraction fails
          revalidatePath(url);
        }

        if (getAdditionalPaths) {
          const additionalPaths = getAdditionalPaths(url);
          additionalPaths.forEach((additionalPath) => {
            revalidatePath(additionalPath);
          });
        }
      }
    }
    return doc;
  };
};

// Global revalidation hooks
export const revalidateHomepage = createGlobalRevalidateHook();
export const revalidateBlog = createGlobalRevalidateHook();
export const revalidatePrivacyPolicy = createGlobalRevalidateHook();
export const revalidateCookiePolicy = createGlobalRevalidateHook();
export const revalidateTermsAndConditions = createGlobalRevalidateHook();

// Helper to extract blog listing path from blog post URL
const getBlogListingPaths = (url: string | null): string[] => {
  if (!url) return [];
  const basePath = extractBasePath(url);
  if (!basePath || !basePath.startsWith("/blog")) return [];

  // Extract the base blog path (e.g., "/blog" from "/blog/my-post")
  const blogBasePath = "/blog";
  return generateLocalizedPaths(blogBasePath);
};

// Collection revalidation hooks
export const revalidatePage: CollectionAfterChangeHook<Page> =
  createCollectionRevalidateHook<Page>();

export const revalidateDelete: CollectionAfterDeleteHook<Page> =
  createCollectionDeleteHook<Page>();

export const revalidateBlogPost: CollectionAfterChangeHook<BlogPost> =
  createCollectionRevalidateHook<BlogPost>(getBlogListingPaths);

export const revalidateBlogPostDelete: CollectionAfterDeleteHook<BlogPost> =
  createCollectionDeleteHook<BlogPost>(getBlogListingPaths);

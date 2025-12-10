"use server";

import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import type { Page } from "@/payload-types";
import { revalidatePath, revalidateTag } from "next/cache";
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
      // Check if URL changed
      const urlChanged =
        previousDoc?.url &&
        doc.url &&
        typeof previousDoc.url === "string" &&
        typeof doc.url === "string" &&
        previousDoc.url !== doc.url;

      // Revalidate new URL if page is published
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

          // Revalidate sitemap when content changes
          revalidateTag("sitemap", "max");
        }
      }

      // Revalidate old URL if it changed and was published
      if (urlChanged && previousDoc?._status === "published") {
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

          // Revalidate sitemap when content changes
          revalidateTag("sitemap", "max");
        }
      }

      // Revalidate when page status changes from published to draft
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

          // Revalidate sitemap when content changes
          revalidateTag("sitemap", "max");
        }
      }

      // Revalidate homepage when any page URL changes
      if (urlChanged && doc._status === "published") {
        const homepagePaths = generateLocalizedPaths("/");
        homepagePaths.forEach((path) => {
          revalidatePath(path);
        });
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

        // Revalidate sitemap when content is deleted
        revalidateTag("sitemap", "max");
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

// Helper to revalidate sitemap
const revalidateSitemap = () => {
  revalidateTag("sitemap", "max");
};

export const revalidatePage: CollectionAfterChangeHook<Page> =
  createCollectionRevalidateHook<Page>();

export const revalidateDelete: CollectionAfterDeleteHook<Page> =
  createCollectionDeleteHook<Page>();

// Custom hook for blog posts that also revalidates sitemap
export const revalidateBlogPost: CollectionAfterChangeHook<BlogPost> = async (
  args,
) => {
  const { doc, previousDoc, req } = args;
  if (!req.context.disableRevalidate) {
    const baseHook =
      createCollectionRevalidateHook<BlogPost>(getBlogListingPaths);
    const result = baseHook(args);

    // Revalidate sitemap when content changes
    if (doc._status === "published" || previousDoc?._status === "published") {
      revalidateSitemap();
    }

    return result;
  }
  return doc;
};

// Custom hook for blog post deletion that also revalidates sitemap
export const revalidateBlogPostDelete: CollectionAfterDeleteHook<
  BlogPost
> = async (args) => {
  const { doc, req } = args;
  if (!req.context.disableRevalidate) {
    const baseHook = createCollectionDeleteHook<BlogPost>(getBlogListingPaths);
    const result = baseHook(args);

    // Revalidate sitemap when content is deleted
    revalidateSitemap();

    return result;
  }
  return doc;
};

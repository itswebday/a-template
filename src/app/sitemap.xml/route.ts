import { unstable_cache } from "next/cache";
import { getServerSideSitemap } from "next-sitemap";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import type { LocaleOption } from "@/types";
import { getCachedPayload, handleApiError } from "@/utils/server";

const getSitemap = unstable_cache(
  async () => {
    const payload = await getCachedPayload();
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

    // Initialize date fallback and sitemap
    const dateFallback = new Date().toISOString();
    const sitemap: Array<{ loc: string; lastmod: string }> = [];

    // Add default pages for all locales
    for (const locale of LOCALES) {
      // Get base URL
      const baseUrl = locale === DEFAULT_LOCALE ? "" : `/${locale}`;

      // Add home page for all locales
      sitemap.push({
        loc: `${SITE_URL}${baseUrl}`,
        lastmod: dateFallback,
      });

      // Add blog page for all locales
      sitemap.push({
        loc: `${SITE_URL}${baseUrl}/blog`,
        lastmod: dateFallback,
      });
    }

    // Fetch pages for all locales
    for (const locale of LOCALES) {
      const results = await payload.find({
        collection: "pages",
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        locale: locale as LocaleOption,
        where: {
          _status: {
            equals: "published",
          },
        },
        select: {
          urlWithoutLocale: true,
          updatedAt: true,
        },
      });

      // Get base URL
      const baseUrl = locale === DEFAULT_LOCALE ? "" : `/${locale}`;

      // Filter pages
      results.docs
        ?.filter((page) => {
          // Exclude home page (already added above)
          return (
            page.urlWithoutLocale &&
            page.urlWithoutLocale !== "/" &&
            page.urlWithoutLocale !== null
          );
        })
        .forEach((page) => {
          // Add page to sitemap
          sitemap.push({
            loc: `${SITE_URL}${baseUrl}${page.urlWithoutLocale}`,
            lastmod: page.updatedAt
              ? new Date(page.updatedAt).toISOString()
              : dateFallback,
          });
        });
    }

    // Fetch blog posts for all locales
    for (const locale of LOCALES) {
      const results = await payload.find({
        collection: "blog-posts",
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        locale: locale as LocaleOption,
        where: {
          _status: {
            equals: "published",
          },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
      });

      // Get base URL
      const baseUrl = locale === DEFAULT_LOCALE ? "" : `/${locale}`;

      // Filter blog posts
      results.docs
        ?.filter((post) => Boolean(post?.slug))
        .forEach((post) => {
          // Add blog post to sitemap
          sitemap.push({
            loc: `${SITE_URL}${baseUrl}/blog/${post.slug}`,
            lastmod: post.updatedAt
              ? new Date(post.updatedAt).toISOString()
              : dateFallback,
          });
        });
    }

    return sitemap;
  },
  ["sitemap"],
  {
    tags: ["pages-sitemap", "blog-posts-sitemap"],
  },
);

export const GET = async () => {
  try {
    // Generate sitemap
    const sitemap = await getSitemap();

    // Return sitemap
    return getServerSideSitemap(sitemap);
  } catch (errorResponse) {
    // Error response
    return handleApiError(errorResponse, "Failed to generate sitemap", 500);
  }
};

import { NextRequest, NextResponse } from "next/server";
import type { GlobalSlug } from "payload";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import type { LocaleOption } from "@/types";
import { getCachedPayload, handleApiError } from "@/utils/server";

const getGlobalUrl = (global: unknown): string | null => {
  if (
    typeof global === "object" &&
    global !== null &&
    "url" in global &&
    global.url
  ) {
    if (typeof global.url === "string") {
      return global.url;
    }
  }
  return null;
};

export const GET = async (request: NextRequest) => {
  try {
    // Get search parameters
    const searchParams = request.nextUrl.searchParams;
    const locale = (searchParams.get("locale") ||
      DEFAULT_LOCALE) as LocaleOption;
    const pageLabel = searchParams.get("pageLabel");
    const pageSlug = searchParams.get("pageSlug");

    // Validate page label
    if (!pageLabel) {
      return handleApiError(null, "pageLabel is required", 400);
    }

    // Initialize localized URLs
    const localizedUrls: Record<LocaleOption, string> = {} as Record<
      LocaleOption,
      string
    >;

    // Get Payload client
    const payload = await getCachedPayload();

    // Find page by slug
    if ((pageLabel === "home" || pageLabel === "blog") && pageSlug !== "") {
      const page = await payload.find({
        collection: pageLabel === "home" ? "pages" : "blog-posts",
        locale: locale,
        where: {
          and: [
            {
              slug: {
                equals: pageSlug,
              },
            },
            { _status: { equals: "published" } },
          ],
        },
        limit: 1,
        pagination: false,
        draft: false,
        overrideAccess: false,
      });

      // Find localized pages
      const localizedPages = await Promise.all(
        LOCALES.map((loc) =>
          payload.find({
            collection: pageLabel === "home" ? "pages" : "blog-posts",
            locale: loc,
            where: {
              and: [
                {
                  id: {
                    equals: page.docs?.[0]?.id,
                  },
                },
                { _status: { equals: "published" } },
              ],
            },
            limit: 1,
            pagination: false,
            draft: false,
            overrideAccess: false,
          }),
        ),
      );

      // Set localized URLs
      LOCALES.forEach((loc, index) => {
        const localizedPage = localizedPages[index].docs?.[0];

        // Set localized URL
        if (localizedPage && "url" in localizedPage && localizedPage.url) {
          const url = localizedPage.url;

          // Set localized URL
          localizedUrls[loc] =
            url || (loc === DEFAULT_LOCALE ? "/" : `/${loc}`);
        } else {
          localizedUrls[loc] = loc === DEFAULT_LOCALE ? "/" : `/${loc}`;
        }
      });
    } else {
      // Find global by slug
      if (pageLabel) {
        const globalResults = await Promise.all(
          LOCALES.map((loc) =>
            payload.findGlobal({
              slug: pageLabel as GlobalSlug,
              locale: loc,
              draft: false,
              overrideAccess: false,
            }),
          ),
        );

        // Set localized URLs
        LOCALES.forEach((loc, index) => {
          const global = globalResults[index];
          const url = getGlobalUrl(global);
          localizedUrls[loc] =
            url || (loc === DEFAULT_LOCALE ? "/" : `/${loc}`);
        });
      } else {
        // Set localized URLs
        for (const loc of LOCALES) {
          localizedUrls[loc] = loc === DEFAULT_LOCALE ? "/" : `/${loc}`;
        }
      }
    }

    // Success response
    return NextResponse.json({
      data: { localizedUrls: localizedUrls },
      status: 200,
    });
  } catch (errorResponse) {
    // Error response
    return handleApiError(errorResponse);
  }
};

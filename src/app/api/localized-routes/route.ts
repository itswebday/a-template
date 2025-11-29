import configPromise from "@/payload.config";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import type { LocaleOption } from "@/types";
import { handleApiError } from "@/utils/server";
import { getPayload, type GlobalSlug } from "payload";
import { NextRequest, NextResponse } from "next/server";

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
    const searchParams = request.nextUrl.searchParams;
    const locale = (searchParams.get("locale") ||
      DEFAULT_LOCALE) as LocaleOption;
    const pageLabel = searchParams.get("pageLabel");
    const pageSlug = searchParams.get("pageSlug");

    if (!pageLabel) {
      return NextResponse.json(
        { error: "pageLabel is required" },
        { status: 400 },
      );
    }

    const localizedUrls: Record<LocaleOption, string> = {} as Record<
      LocaleOption,
      string
    >;
    const payload = await getPayload({ config: configPromise });

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

      LOCALES.forEach((loc, index) => {
        const localizedPage = localizedPages[index].docs?.[0];

        if (localizedPage && "url" in localizedPage && localizedPage.url) {
          const url = localizedPage.url;

          localizedUrls[loc] =
            url || (loc === DEFAULT_LOCALE ? "/" : `/${loc}`);
        } else {
          localizedUrls[loc] = loc === DEFAULT_LOCALE ? "/" : `/${loc}`;
        }
      });
    } else {
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

        LOCALES.forEach((loc, index) => {
          const global = globalResults[index];
          const url = getGlobalUrl(global);
          localizedUrls[loc] =
            url || (loc === DEFAULT_LOCALE ? "/" : `/${loc}`);
        });
      } else {
        for (const loc of LOCALES) {
          localizedUrls[loc] = loc === DEFAULT_LOCALE ? "/" : `/${loc}`;
        }
      }
    }

    return NextResponse.json({
      data: { localizedUrls: localizedUrls },
      status: 200,
    });
  } catch (errorResponse) {
    return handleApiError(errorResponse);
  }
};

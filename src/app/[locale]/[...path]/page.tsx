import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import React from "react";
import { blockComponents } from "@/blocks";
import { PageWrapper, PreviewListener } from "@/components";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import type { Page } from "@/payload-types";
import type { LocaleOption } from "@/types";
import { getCachedPayload, getMetadata } from "@/utils/server";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    locale: string;
    path: string[];
  }>;
};

const PageComponent = async ({ params }: PageProps) => {
  const { locale = DEFAULT_LOCALE, path } = await params;

  if (!LOCALES.includes(locale as LocaleOption)) {
    return notFound();
  }

  const draft = await draftMode();
  const url =
    path && path.length > 0
      ? `${locale === DEFAULT_LOCALE ? "" : `/${locale}`}/${path.join("/")}`
      : locale === DEFAULT_LOCALE
        ? "/"
        : `/${locale}`;
  const page = await queryPageByUrl({
    url: url,
    locale: locale as LocaleOption,
    draft: draft.isEnabled,
  });

  if (!page || !page.slug) {
    return notFound();
  }

  const { blocks, slug } = page;

  return (
    <PageWrapper pageLabel="home" pageSlug={slug}>
      <main>
        {draft.isEnabled && <PreviewListener />}
        {blocks && Array.isArray(blocks) && blocks.length > 0 && (
          <>
            {blocks.map((block, index) => {
              const BlockComponent = blockComponents[
                block.blockType
              ] as React.ComponentType<typeof block>;

              if (BlockComponent) {
                return <BlockComponent key={index} {...block} />;
              }

              return null;
            })}
          </>
        )}
      </main>
    </PageWrapper>
  );
};

export default PageComponent;

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { locale = DEFAULT_LOCALE, path } = await params;
  const pageNotFoundT = await getTranslations("pageNotFound");

  if (!LOCALES.includes(locale as LocaleOption)) {
    return {
      title: pageNotFoundT("title"),
    };
  }

  const url =
    path && path.length > 0
      ? `${locale === DEFAULT_LOCALE ? "" : `/${locale}`}/${path.join("/")}`
      : locale === DEFAULT_LOCALE
        ? "/"
        : `/${locale}`;
  const page = await queryPageByUrl({
    url: url,
    locale: locale as LocaleOption,
    draft: false,
  });

  return getMetadata({ doc: page, locale });
};

export const generateStaticParams = async () => {
  try {
    const payload = await getCachedPayload();
    const params: { locale: string; path: string[] }[] = [];

    for (const locale of LOCALES) {
      const pages = await payload.find({
        collection: "pages",
        locale: locale,
        select: {
          urlWithoutLocale: true,
        },
        limit: 1000,
        pagination: false,
        draft: false,
        overrideAccess: false,
      });

      pages.docs?.forEach((doc) => {
        if (
          doc.urlWithoutLocale === null ||
          !doc.urlWithoutLocale ||
          doc.urlWithoutLocale === "/"
        ) {
          return;
        }

        params.push({ locale, path: doc.urlWithoutLocale.slice(1).split("/") });
      });
    }

    return params;
  } catch (error) {
    console.warn(
      "Failed to generate static params for pages. Database migration needed.",
      error,
    );

    return [];
  }
};

const queryPageByUrl = async ({
  url,
  locale,
  draft,
}: {
  url: string;
  locale: LocaleOption;
  draft: boolean;
}): Promise<Page | null> => {
  const payload = await getCachedPayload();
  const result = await payload.find({
    collection: "pages",
    locale: locale,
    where: {
      and: [
        {
          url: {
            equals: url,
          },
        },
        ...(draft ? [] : [{ _status: { equals: "published" } }]),
      ],
    },
    limit: 1,
    pagination: false,
    draft: draft,
    overrideAccess: draft,
  });

  return (result.docs?.[0] as Page) || null;
};

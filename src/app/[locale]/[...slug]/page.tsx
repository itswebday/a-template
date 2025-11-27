import type { Metadata } from "next";
import { PageWrapper, PreviewListener } from "@/components";
import { blockComponents } from "@/blocks";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import { getMetadata } from "@/utils/metadata";
import { LocaleOption } from "@/types";
import { draftMode } from "next/headers";
import configPromise from "@/payload.config";
import { getPayload } from "payload";
import React from "react";
import type { Page } from "@/payload-types";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export const generateStaticParams = async () => {
  try {
    const payload = await getPayload({ config: configPromise });
    const params: { locale: string; slug: string[] }[] = [];

    for (const locale of LOCALES) {
      const pages = await payload.find({
        collection: "pages",
        draft: false,
        limit: 1000,
        overrideAccess: false,
        pagination: false,
        locale,
        select: {
          url: true,
        },
      });

      pages.docs?.forEach((doc) => {
        const url = Array.isArray(doc.url) ? doc.url[0] : doc.url;

        if (url === null || !url || url === "/") {
          return;
        }

        const slug = url.startsWith("/")
          ? url.slice(1).split("/")
          : url.split("/");
        params.push({ locale, slug });
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

type PageProps = {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
};

const PageComponent = async ({ params }: PageProps) => {
  const { locale = DEFAULT_LOCALE, slug } = await params;
  const draft = await draftMode();
  const urlPath = slug && slug.length > 0 ? `/${slug.join("/")}` : "/";
  const page = await queryPageByUrl({
    url: urlPath,
    locale: locale as LocaleOption,
    draft: draft.isEnabled,
  });

  if (!page) {
    return notFound();
  }

  const { blocks } = page;

  return (
    <PageWrapper pageLabel={urlPath} pageSlug={urlPath}>
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
  const { locale = DEFAULT_LOCALE, slug } = await params;
  const urlPath = slug && slug.length > 0 ? `/${slug.join("/")}` : "/";
  const page = await queryPageByUrl({
    url: urlPath,
    locale: locale as LocaleOption,
    draft: false,
  });

  return getMetadata({ doc: page, locale });
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
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: "pages",
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    locale,
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
  });

  return (result.docs?.[0] as Page) || null;
};

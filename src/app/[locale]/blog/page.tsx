import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getLocale } from "next-intl/server";
import { PageWrapper, PreviewListener } from "@/components";
import type { LocaleOption } from "@/types";
import {
  getCachedCollection,
  getCachedGlobal,
  getCollection,
  getGlobal,
  getMetadata,
} from "@/utils/server";
import { Blog } from "./_ui";

const BlogPage = async () => {
  const draft = await draftMode();
  const locale = (await getLocale()) as LocaleOption;

  const blog = draft.isEnabled
    ? ((await getGlobal("blog", locale)) as {
        heading?: string;
        paragraph?: string;
      } | null)
    : ((await getCachedGlobal("blog", locale)()) as {
        heading?: string;
        paragraph?: string;
      } | null);

  const blogPosts = draft.isEnabled
    ? await getCollection("blog-posts", locale, {
        sort: { field: "publishedAt", direction: "desc" },
        filters: [{ field: "_status", operator: "equals", value: "published" }],
        depth: 1,
      })
    : await getCachedCollection("blog-posts", locale, {
        sort: { field: "publishedAt", direction: "desc" },
        filters: [{ field: "_status", operator: "equals", value: "published" }],
        depth: 1,
      })();

  return (
    <PageWrapper pageLabel="blog">
      <main>
        {draft.isEnabled && <PreviewListener />}
        <Blog blog={blog} blogPosts={blogPosts} />
      </main>
    </PageWrapper>
  );
};

export default BlogPage;

export const revalidate = 3600;

export const generateStaticParams = async () => {
  const { LOCALES } = await import("@/constants");
  return LOCALES.map((locale) => ({ locale }));
};

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = (await getLocale()) as LocaleOption;
  const blog = await getCachedGlobal("blog", locale)();

  return getMetadata({ doc: blog, locale });
};

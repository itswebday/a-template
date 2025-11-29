import { PageWrapper } from "@/components";
import { getCollection, getGlobal } from "@/utils/server";
import type { LocaleOption } from "@/types";
import { getMetadata } from "@/utils/metadata";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Blog } from "./_ui";

export const dynamic = "force-dynamic";

const BlogPage = async () => {
  const locale = (await getLocale()) as LocaleOption;
  const blog = (await getGlobal("blog", locale)) as {
    heading?: string;
    paragraph?: string;
  } | null;
  const blogPosts = await getCollection("blog-posts", locale, {
    sort: { field: "publishedAt", direction: "desc" },
    filters: [{ field: "_status", operator: "equals", value: "published" }],
    depth: 1,
  });

  return (
    <PageWrapper pageLabel="blog">
      <main>
        <Blog blog={blog} blogPosts={blogPosts} />
      </main>
    </PageWrapper>
  );
};

export default BlogPage;

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = (await getLocale()) as LocaleOption;
  const blog = await getGlobal("blog", locale);

  return getMetadata({ doc: blog, locale });
};

import { PageWrapper, PreviewListener } from "@/components";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import type { Config } from "@/payload-types";
import type { LocaleOption } from "@/types";
import { getCollection, getDocument, getMetadata } from "@/utils/server";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { BlogPost, BlogPostHeader } from "./_ui";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export const generateStaticParams = async () => {
  try {
    const { getPayload } = await import("payload");
    const configPromise = await import("@/payload.config").then(
      (m) => m.default,
    );
    const payload = await getPayload({ config: configPromise });
    const params: { locale: string; slug: string }[] = [];

    const { LOCALES } = await import("@/constants");

    for (const locale of LOCALES) {
      const blogPosts = await payload.find({
        collection: "blog-posts",
        draft: false,
        limit: 1000,
        overrideAccess: false,
        pagination: false,
        locale,
        where: {
          _status: {
            equals: "published",
          },
        },
        select: {
          slug: true,
        },
      });

      blogPosts.docs?.forEach((doc) => {
        if (doc.slug) {
          params.push({ locale, slug: doc.slug });
        }
      });
    }

    return params;
  } catch (error) {
    console.warn(
      "Failed to generate static params for blogs. Database migration needed.",
      error,
    );

    return [];
  }
};

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { locale = DEFAULT_LOCALE, slug } = await params;
  const { LOCALES } = await import("@/constants");
  const blogT = await getTranslations("blog");

  if (!LOCALES.includes(locale as LocaleOption)) {
    redirect(blogT("href"));
  }

  const draft = await draftMode();
  const blogPost = (await getDocument(
    "blog-posts",
    "slug",
    slug,
    locale as LocaleOption,
    2,
  )) as Config["collections"]["blog-posts"] | null;

  if (!blogPost) {
    redirect(blogT("href"));
  }

  if (!draft.isEnabled && blogPost._status !== "published") {
    redirect(blogT("href"));
  }

  const allBlogPosts = await getCollection(
    "blog-posts",
    locale as LocaleOption,
    {
      sort: { field: "publishedAt", direction: "desc" },
      filters: [{ field: "_status", operator: "equals", value: "published" }],
      depth: 1,
    },
  );

  return (
    <PageWrapper pageLabel="blog" pageSlug={slug}>
      {draft.isEnabled && <PreviewListener />}
      <main>
        <BlogPostHeader
          title={blogPost.title}
          locale={locale as LocaleOption}
        />
        <BlogPost blogPost={blogPost} allBlogPosts={allBlogPosts} />
      </main>
    </PageWrapper>
  );
};

export default BlogPostPage;

export const generateMetadata = async ({
  params,
}: BlogPostPageProps): Promise<Metadata> => {
  const { locale = DEFAULT_LOCALE, slug } = await params;
  const blogT = await getTranslations("blog");

  if (!LOCALES.includes(locale as LocaleOption)) {
    return {
      title: blogT("blogNotFound"),
    };
  }

  const blogPost = (await getDocument(
    "blog-posts",
    "slug",
    slug,
    locale as LocaleOption,
    2,
  )) as Config["collections"]["blog-posts"] | null;

  if (!blogPost) {
    return {
      title: blogT("blogNotFound"),
    };
  }

  return getMetadata({
    doc: blogPost,
    locale: locale,
    openGraphType: "article",
    publishedTime: blogPost.publishedAt
      ? new Date(blogPost.publishedAt).toISOString()
      : undefined,
  });
};

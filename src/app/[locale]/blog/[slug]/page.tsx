import type { Metadata } from "next";
import { PageWrapper, PreviewListener } from "@/components";
import { RichTextRenderer } from "@/components/server";
import { DEFAULT_LOCALE } from "@/constants";
import { getDocument } from "@/utils/server";
import { LocaleOption, RichText } from "@/types";
import { draftMode } from "next/headers";
import type { Config } from "@/payload-types";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
        const slug = Array.isArray(doc.slug) ? doc.slug[0] : doc.slug;

        if (slug) {
          params.push({ locale, slug });
        }
      });
    }

    return params;
  } catch (error) {
    console.warn(
      "Failed to generate static params for blog posts. Database migration needed.",
      error,
    );

    return [];
  }
};

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { locale = DEFAULT_LOCALE, slug } = await params;
  const draft = await draftMode();
  const blogPost = (await getDocument(
    "blog-posts",
    "slug",
    slug,
    locale as LocaleOption,
    2,
  )) as Config["collections"]["blog-posts"] | null;

  if (!blogPost) {
    redirect("/blog");
  }

  // Check if published (unless in draft mode)
  if (!draft.isEnabled && blogPost._status !== "published") {
    redirect("/blog");
  }

  const url = Array.isArray(blogPost.url) ? blogPost.url[0] : blogPost.url;

  return (
    <PageWrapper pageLabel="blog" pageSlug={slug}>
      {draft.isEnabled && <PreviewListener />}

      {/* Dark Header Section */}
      <section className="relative bg-black text-white pt-32 pb-16 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-linear-to-br from-gray-900/30 via-black to-gray-800/20"></div>
        <div className="absolute inset-0 bg-linear-to-tl from-gray-600/10 via-transparent to-gray-400/5"></div>

        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gray-500/10 rounded-full blur-xl animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-gray-400/15 rounded-full blur-lg animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-16 h-16 bg-gray-600/20 rounded-full blur-md animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
            }}
          ></div>
        </div>

        {/* Geometric Shapes */}
        <div className="absolute top-32 right-1/4 w-2 h-2 bg-gray-400 rounded-full animate-ping"></div>
        <div
          className="absolute top-48 left-1/3 w-1 h-1 bg-gray-300 rounded-full animate-ping"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-32 right-1/3 w-1.5 h-1.5 bg-gray-500 rounded-full animate-ping"
          style={{ animationDelay: "1.5s" }}
        ></div>

        <div className="container-large w-11/12 mx-auto relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Back to Blog Button */}
            <Link
              href="/blog"
              className="inline-flex items-center text-gray-300 hover:text-white mb-8 transition-colors"
            >
              ← Back to Blog
            </Link>

            {/* Blog Title */}
            <h1 className="text-2xl de:text-4xl leading-tight">
              {blogPost.title}
            </h1>
          </div>
        </div>
      </section>

      <main className="bg-gray-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gray-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gray-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-600/3 rounded-full blur-3xl"></div>

        <div className="container-large w-11/12 mx-auto py-20 relative z-10">
          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            <article className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.1)] border border-gray-100/50 overflow-hidden">
              {/* Hero Image */}
              <figure className="relative w-full aspect-2/1 bg-linear-to-br from-gray-100 to-gray-200">
                {typeof blogPost.image === "object" && blogPost.image?.url ? (
                  <Image
                    className="object-cover"
                    src={`${process.env.NEXT_PUBLIC_SERVER_URL}${blogPost.image.url}`}
                    alt={
                      blogPost.image.alt || blogPost.title || "Blog post image"
                    }
                    fill={true}
                    sizes="(max-width: 768px) 100vw, 800px"
                    loading="eager"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg">
                    Blog Image
                  </div>
                )}
              </figure>

              {/* Content */}
              <div className="p-6 lg:p-8">
                {/* Meta information */}
                <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                  {blogPost.publishedAt && (
                    <span>
                      {new Date(blogPost.publishedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
                  )}
                  {blogPost.publishedAt && blogPost.minRead && <span>•</span>}
                  {blogPost.minRead && <span>{blogPost.minRead} min read</span>}
                </div>

                {/* Article Body */}
                <div className="prose prose-lg max-w-none">
                  {blogPost.content && (
                    <RichTextRenderer
                      className="text-base"
                      richText={blogPost.content as RichText}
                    />
                  )}
                </div>

                {/* Article Footer */}
                {blogPost.publishedAt && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        Published on{" "}
                        {new Date(blogPost.publishedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </article>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default BlogPostPage;

export const generateMetadata = async ({
  params,
}: BlogPostPageProps): Promise<Metadata> => {
  const { locale = DEFAULT_LOCALE, slug } = await params;
  const blogPost = (await getDocument(
    "blog-posts",
    "slug",
    slug,
    locale as LocaleOption,
    2,
  )) as Config["collections"]["blog-posts"] | null;

  if (!blogPost) {
    return {
      title: "Blog Post Not Found",
    };
  }

  const ogImage =
    typeof blogPost.meta?.image === "object" &&
    blogPost.meta.image !== null &&
    "url" in blogPost.meta.image
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}${blogPost.meta.image.url}`
      : undefined;
  const url = Array.isArray(blogPost.url)
    ? blogPost.url[0] || "/blog"
    : blogPost.url || "/blog";

  return {
    title: blogPost.meta?.title,
    description: blogPost.meta?.description,
    openGraph: {
      type: "article",
      title: blogPost.meta?.title || "",
      description: blogPost.meta?.description ?? undefined,
      images: ogImage ? [{ url: ogImage }] : undefined,
      url: url,
      publishedTime: blogPost.publishedAt
        ? new Date(blogPost.publishedAt).toISOString()
        : undefined,
    },
  };
};

import type { Metadata } from "next";
import { PageWrapper } from "@/components";
import { getCollection, getGlobal } from "@/utils/server";
import { LocaleOption } from "@/types";
import { getLocale } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = (await getLocale()) as LocaleOption;
  const blog = (await getGlobal("blog", locale)) as {
    meta?: {
      title?: string;
      description?: string;
      image?: unknown;
    };
  } | null;
  const ogImage =
    typeof blog?.meta?.image === "object" &&
    blog.meta.image !== null &&
    "url" in blog.meta.image
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}${blog.meta.image.url}`
      : undefined;

  return {
    title: blog?.meta?.title,
    description: blog?.meta?.description,
    openGraph: {
      type: "website",
      title: blog?.meta?.title || "",
      description: blog?.meta?.description ?? undefined,
      images: ogImage ? [{ url: ogImage }] : undefined,
      url: "/blog",
    },
  };
};

const BlogPage = async () => {
  const locale = (await getLocale()) as LocaleOption;
  const blog = (await getGlobal("blog", locale)) as {
    heading?: string;
    paragraph?: string;
  } | null;
  const blogPosts = await getCollection("blog-posts", locale, {
    sort: { field: "publishedAt", direction: "desc" },
    depth: 1,
    filters: [{ field: "_status", operator: "equals", value: "published" }],
  });

  return (
    <PageWrapper pageLabel="blog">
      <main className="w-full py-12 de:py-20">
        <section className="w-11/12 max-w-300 mx-auto">
          {blog?.heading && (
            <h1 className="text-4xl font-bold mb-4">{blog.heading}</h1>
          )}
          {blog?.paragraph && (
            <p className="text-gray-600 mb-8">{blog.paragraph}</p>
          )}

          {blogPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600">
                No blog posts yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => {
                const url = Array.isArray(post.url) ? post.url[0] : post.url;
                const href = url || "/blog";

                return (
                  <article
                    key={post.id}
                    className="group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                  >
                    <Link href={href} className="block h-full">
                      {/* Image */}
                      {typeof post.image === "object" && post.image?.url && (
                        <figure className="relative w-full aspect-2/1 bg-gray-200 overflow-hidden">
                          <Image
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            src={`${process.env.NEXT_PUBLIC_SERVER_URL}${post.image.url}`}
                            alt={
                              post.image.alt || post.title || "Blog post image"
                            }
                            fill={true}
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            loading="eager"
                          />
                        </figure>
                      )}

                      {/* Content */}
                      <div className="p-6">
                        {/* Date */}
                        {post.publishedAt && (
                          <div className="text-sm text-gray-500 mb-2">
                            {new Date(post.publishedAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </div>
                        )}

                        {/* Title */}
                        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                          {post.title}
                        </h2>

                        {/* Description */}
                        {post.meta?.description && (
                          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                            {post.meta.description}
                          </p>
                        )}

                        {/* Read More */}
                        <div className="text-blue-600 font-medium text-sm group-hover:underline">
                          Read more →
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </PageWrapper>
  );
};

export default BlogPage;

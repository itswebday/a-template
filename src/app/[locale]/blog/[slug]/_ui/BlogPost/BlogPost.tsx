import { RichTextRenderer } from "@/components/server";
import type { Config } from "@/payload-types";
import type { LocaleOption, RichText } from "@/types";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import BlogSidebar from "./BlogSidebar";

type BlogPostProps = {
  blogPost: Config["collections"]["blog-posts"];
  allBlogPosts: Config["collections"]["blog-posts"][];
};

const BlogPost = async ({ blogPost, allBlogPosts }: BlogPostProps) => {
  const locale = (await getLocale()) as LocaleOption;
  const blogT = await getTranslations("blog");

  return (
    <section className="w-full bg-gray-100">
      {/* Container */}
      <div
        className={`
          flex flex-col gap-8 w-11/12 max-w-300 py-12 mx-auto
          me:flex-row me:py-20
        `}
      >
        {/* Content */}
        <article
          className={`
            w-full bg-white/80 rounded-3xl
            border border-gray-100/50 overflow-hidden backdrop-blur-sm
            shadow-[0px_2px_2px_0px_rgba(0,0,0,0.1)]
          `}
        >
          {/* Image */}
          <figure className="relative w-full aspect-2/1">
            {typeof blogPost.image === "object" && blogPost.image?.url ? (
              <Image
                className="object-cover"
                src={`${
                  process.env.NEXT_PUBLIC_SERVER_URL
                }${blogPost.image.url}`}
                alt={blogPost.image.alt || blogPost.title}
                fill={true}
                sizes="(max-width: 1100px) 100vw, 768px"
                loading="eager"
              />
            ) : (
              <div className="absolute inset-0" />
            )}
          </figure>

          {/* Content */}
          <div className="flex flex-col gap-6 p-6 me:p-8">
            {/* Blog post meta information */}
            <div className="flex gap-2 text-[14px] text-gray-500">
              {/* Published at */}
              {blogPost.publishedAt && (
                <span>
                  {new Date(blogPost.publishedAt).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}

              {/* Separating dot */}
              {blogPost.publishedAt && blogPost.minRead && <span>•</span>}

              {/* Reading time */}
              {blogPost.minRead && (
                <span>
                  {blogPost.minRead} {blogT("minRead")}
                </span>
              )}
            </div>

            {/* Blog post content */}
            <div className="prose prose-lg max-w-none">
              {blogPost.content && (
                <RichTextRenderer
                  className="text-base"
                  richText={blogPost.content as RichText}
                />
              )}
            </div>

            {/* Published at */}
            {blogPost.publishedAt && (
              <span
                className={`
                  pt-4 mt-4 text-[14px] text-gray-500
                  border-t border-gray-200
                `}
              >
                {blogT("publishedOn")}{" "}
                {new Date(blogPost.publishedAt).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </article>

        {/* Sidebar */}
        <BlogSidebar
          className="shrink-0 w-full h-fit max-w-120 mx-auto me:w-100"
          allBlogPosts={allBlogPosts}
          currentSlug={blogPost.slug || ""}
        />
      </div>
    </section>
  );
};

export default BlogPost;

"use client";

import type { Config } from "@/payload-types";
import { DEFAULT_LOCALE } from "@/constants";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import type { LocaleOption } from "@/types";

type BlogSidebarProps = {
  className?: string;
  allBlogPosts: Config["collections"]["blog-posts"][];
  currentSlug: string;
};

const BlogSidebar: React.FC<BlogSidebarProps> = ({
  className,
  allBlogPosts,
  currentSlug,
}) => {
  const locale = useLocale() as LocaleOption;
  const blogT = useTranslations("blog");
  const relatedPosts = allBlogPosts
    .filter((post) => {
      return post.slug !== currentSlug;
    })
    .slice(0, 3);

  return (
    <aside
      className={`
        sticky top-8 px-6 py-8 bg-white rounded-3xl
        shadow-[0px_2px_2px_0px_rgba(0,0,0,0.1)]
        ${className}
      `}
    >
      {/* Header */}
      <header className="flex flex-col gap-2 mb-6">
        {/* Heading */}
        <h5>{blogT("sideBar.heading")}</h5>

        {/* Paragraph */}
        <p className="text-[14px]">{blogT("sideBar.paragraph")}</p>
      </header>

      {/* Blog posts */}
      {relatedPosts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {relatedPosts.map((post) => {
            return (
              <Link
                className={`
                  p-3 rounded-lg transition-colors duration-200 group
                  hover:bg-gray-100
                `}
                key={post.id}
                href={
                  post.url || `${locale === DEFAULT_LOCALE ? "" : `/${locale}`}`
                }
                prefetch={true}
              >
                <div className="flex gap-3">
                  {/* Image */}
                  <figure
                    className={`
                      relative w-16 h-16 shrink-0 rounded-lg overflow-hidden
                    `}
                  >
                    {post.image &&
                    typeof post.image === "object" &&
                    "url" in post.image ? (
                      <Image
                        className="object-cover"
                        src={`${
                          process.env.NEXT_PUBLIC_SERVER_URL
                        }${post.image.url}`}
                        alt={post.image.alt || post.title}
                        fill={true}
                        sizes="64px"
                      />
                    ) : (
                      <div className="absolute inset-0" />
                    )}
                  </figure>

                  {/* Content */}
                  <div className="flex flex-col gap-1 flex-1">
                    {/* Title */}
                    <h5
                      className={`
                        text-gray-900 line-clamp-2
                        transition-colors duration-200 group-hover:text-blue-600
                      `}
                    >
                      {post.title}
                    </h5>

                    {/* Published at */}
                    {post.publishedAt && (
                      <p className="text-[12px] text-gray-500">
                        {new Date(post.publishedAt).toLocaleDateString(locale, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    )}

                    {/* Reading time */}
                    {post.minRead && (
                      <p className="text-[12px] text-gray-400">
                        {post.minRead} {blogT("minRead")}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          {/* No blog posts */}
          <p className="text-[14px] text-gray-500">{blogT("noPosts")}</p>
        </div>
      )}
    </aside>
  );
};

export default BlogSidebar;

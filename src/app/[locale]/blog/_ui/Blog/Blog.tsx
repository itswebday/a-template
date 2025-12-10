import { getLocale, getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import { BackButton } from "@/components";
import { DEFAULT_LOCALE } from "@/constants";
import type { Config } from "@/payload-types";
import type { LocaleOption } from "@/types";
import BlogClient from "./BlogClient";

type BlogProps = {
  blog: {
    heading?: string;
    paragraph?: string;
  } | null;
  blogPosts: Config["collections"]["blog-posts"][];
};

const Blog = async ({ blog, blogPosts }: BlogProps) => {
  const locale = (await getLocale()) as LocaleOption;
  const blogT = await getTranslations("blog");
  const homeHref = locale === DEFAULT_LOCALE ? "/" : `/${locale}`;

  return (
    <section className={twMerge("w-full py-12", "de:py-20")}>
      {/* Container */}
      <div className="w-11/12 max-w-7xl mx-auto">
        {/* Back button */}
        <div className={twMerge("mb-8", "de:mb-12")}>
          <BackButton href={homeHref}>{blogT("backToHome")}</BackButton>
        </div>

        {/* Heading and paragraph */}
        {(blog?.heading || blog?.paragraph) && (
          <div className={twMerge("mb-12 text-center", "de:mb-16")}>
            {blog.heading && (
              <h1
                className={twMerge(
                  "mb-4 text-[28px] font-bold text-dark",
                  "de:text-[36px]",
                )}
              >
                {blog.heading}
              </h1>
            )}

            {blog.paragraph && (
              <p
                className={twMerge(
                  "mx-auto max-w-2xl text-[15px] text-dark/70",
                  "de:text-[16px]",
                )}
              >
                {blog.paragraph}
              </p>
            )}
          </div>
        )}

        {/* Blog posts */}
        {blogPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-dark/60">{blogT("noPosts")}</p>
          </div>
        ) : (
          <BlogClient
            blogPosts={blogPosts.map((post) => {
              const image =
                typeof post.image === "object" &&
                post.image !== null &&
                "url" in post.image
                  ? post.image
                  : null;

              return {
                id: post.id,
                slug: post.slug,
                url: post.url,
                image: image,
                title: post.title,
                publishedAt: post.publishedAt,
                description: post.meta?.description,
              };
            })}
            locale={locale}
            readMoreText={blogT("readMore")}
            formattedDates={blogPosts.map((post) =>
              post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : null,
            )}
          />
        )}
      </div>
    </section>
  );
};

export default Blog;

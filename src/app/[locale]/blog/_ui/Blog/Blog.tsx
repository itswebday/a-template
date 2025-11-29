import { DEFAULT_LOCALE } from "@/constants";
import type { Config } from "@/payload-types";
import type { LocaleOption } from "@/types";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

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

  return (
    <section className="w-full py-12 de:py-20">
      {/* Container */}
      <div className="w-11/12 max-w-300 mx-auto">
        {/* Heading */}
        {blog?.heading && (
          <h1 className="font-semibold mb-4">{blog.heading}</h1>
        )}

        {/* Paragraph */}
        {blog?.paragraph && <p className="mb-8">{blog.paragraph}</p>}

        {/* Blog posts */}
        {blogPosts.length === 0 ? (
          <div className="text-center py-16">
            {/* No blog posts */}
            <p>{blogT("noPosts")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => {
              const href =
                post.url ||
                `${locale === DEFAULT_LOCALE ? "" : `/${locale}`}/blog`;

              return (
                <article
                  className={`
                    bg-white rounded-2xl shadow-md overflow-hidden
                    transition-all duration-300 group hover:shadow-lg
                  `}
                  key={post.id}
                >
                  {/* Post */}
                  <Link href={href} prefetch={true}>
                    {/* Image */}
                    {typeof post.image === "object" && post.image?.url && (
                      <figure
                        className={`
                          relative w-full aspect-2/1 overflow-hidden
                        `}
                      >
                        {post.image &&
                        typeof post.image === "object" &&
                        "url" in post.image ? (
                          <Image
                            className={`
                              object-cover transition-transform duration-500
                              group-hover:scale-110
                            `}
                            src={`${
                              process.env.NEXT_PUBLIC_SERVER_URL
                            }${post.image.url}`}
                            alt={post.image.alt || post.title}
                            fill={true}
                            sizes={`
                              (max-width: 550px) 100vw,
                              (max-width: 900px) 50vw,
                              33vw
                            `}
                            loading="eager"
                          />
                        ) : (
                          <div className="absolute inset-0" />
                        )}
                      </figure>
                    )}

                    {/* Content */}
                    <div className="flex flex-col gap-4 px-8 py-6">
                      {/* Published at */}
                      {post.publishedAt && (
                        <div className="text-[14px] opacity-50">
                          {new Date(post.publishedAt).toLocaleDateString(
                            locale,
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </div>
                      )}

                      {/* Title */}
                      <h3
                        className={`
                          transition-colors duration-300
                          group-hover:text-blue-600
                        `}
                      >
                        {post.title}
                      </h3>

                      {/* Description */}
                      {post.meta?.description && (
                        <p className="text-[14px] line-clamp-3">
                          {post.meta.description}
                        </p>
                      )}

                      {/* Read more */}
                      <span
                        className={`
                          text-[14px] underline
                          transition-colors duration-300
                          group-hover:text-blue-600
                        `}
                      >
                        {blogT("readMore")}
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;

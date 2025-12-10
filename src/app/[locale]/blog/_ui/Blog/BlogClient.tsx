"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { DEFAULT_LOCALE } from "@/constants";
import type { Media } from "@/payload-types";
import type { LocaleOption } from "@/types";

export type BlogPostData = {
  id: number;
  slug?: string | null;
  url?: string | null;
  image?: Media | null;
  title: string;
  publishedAt?: string | null;
  description?: string | null;
};

type BlogClientProps = {
  blogPosts: BlogPostData[];
  locale: LocaleOption;
  readMoreText: string;
  formattedDates: (string | null)[];
};

const BlogClient: React.FC<BlogClientProps> = ({
  blogPosts,
  locale,
  readMoreText,
  formattedDates,
}) => {
  return (
    <div
      className={twMerge(
        "grid grid-cols-1 gap-6",
        "xs:grid-cols-2",
        "de:gap-8",
        "lg:grid-cols-3",
      )}
    >
      {blogPosts.map((post, index) => {
        const href =
          post.url ||
          `${locale === DEFAULT_LOCALE ? "" : `/${locale}`}/blog/${
            post.slug || ""
          }`;
        const formattedDate = formattedDates[index];

        return (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
          >
            <Link href={href} prefetch={true}>
              <div
                className={twMerge(
                  "overflow-hidden rounded-2xl border-2 border-gray-100",
                  "bg-white transition-all duration-300",
                  "hover:border-primary-purple/30 hover:shadow-xl",
                  "hover:shadow-primary-purple/10 hover:-translate-y-1",
                )}
              >
                {/* Image */}
                {typeof post.image === "object" && post.image?.url && (
                  <figure
                    className={twMerge(
                      "relative w-full aspect-2/1 overflow-hidden bg-gray-100",
                    )}
                  >
                    {post.image &&
                    typeof post.image === "object" &&
                    "url" in post.image ? (
                      <motion.div
                        className="relative w-full h-full"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Image
                          className={twMerge(
                            "object-cover transition-transform duration-500",
                            "group-hover:scale-110",
                          )}
                          src={`${process.env.NEXT_PUBLIC_SERVER_URL}${
                            post.image.url
                          }`}
                          alt={post.image.alt || post.title}
                          fill={true}
                          sizes={
                            "(max-width: 550px) 100vw, (max-width: 900px) " +
                            "50vw, 33vw"
                          }
                          loading={index < 3 ? "eager" : "lazy"}
                        />
                        <div
                          className={twMerge(
                            "absolute inset-0 bg-linear-to-t from-black/20",
                            "via-transparent to-transparent opacity-0",
                            "transition-opacity duration-300",
                            "group-hover:opacity-100",
                          )}
                        />
                      </motion.div>
                    ) : (
                      <div
                        className={twMerge(
                          "absolute inset-0",
                          "bg-linear-to-br from-gray-200 to-gray-300",
                        )}
                      />
                    )}
                  </figure>
                )}

                {/* Content */}
                <div
                  className={twMerge(
                    "flex flex-col gap-4 px-6 py-6",
                    "de:px-8 de:py-7",
                  )}
                >
                  {/* Published at */}
                  {formattedDate && (
                    <div
                      className={twMerge(
                        "text-[14px] font-medium text-primary-purple",
                      )}
                    >
                      {formattedDate}
                    </div>
                  )}

                  {/* Title */}
                  <h3
                    className={twMerge(
                      "text-[20px] font-bold text-dark line-clamp-2",
                      "transition-colors duration-300",
                      "group-hover:text-primary-purple",
                      "de:text-[24px]",
                    )}
                  >
                    {post.title}
                  </h3>

                  {/* Description */}
                  {post.description && (
                    <p
                      className={twMerge(
                        "text-[14px] text-dark/70 line-clamp-3 leading-relaxed",
                        "de:text-[16px]",
                      )}
                    >
                      {post.description}
                    </p>
                  )}

                  {/* Read more */}
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={twMerge(
                        "text-[14px] font-semibold text-primary-purple",
                        "transition-all duration-300",
                      )}
                    >
                      {readMoreText}
                    </span>
                    <motion.svg
                      className="w-4 h-4 text-primary-purple"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </motion.svg>
                  </div>
                </div>
              </div>
            </Link>
          </motion.article>
        );
      })}
    </div>
  );
};

export default BlogClient;

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { Media } from "@/payload-types";

type RelatedPost = {
  id: number;
  title: string;
  href: string;
  image: Media | null;
  publishedDate: string | null;
  minRead: number | null | undefined;
  renderedTitle: ReactNode;
  renderedDate: ReactNode;
  renderedMinRead: ReactNode;
};

type BlogSidebarProps = {
  className?: string;
  relatedPosts: RelatedPost[];
  headingText: string;
  paragraphText: string;
  noPostsText: string;
};

const BlogSidebar: React.FC<BlogSidebarProps> = ({
  className,
  relatedPosts,
  headingText,
  paragraphText,
  noPostsText,
}) => {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={twMerge(
        "sticky top-8 rounded-3xl border-2 border-gray-100 px-6 py-8 bg-white",
        "shadow-lg shadow-gray-100/50",
        "transition-all duration-300",
        "hover:shadow-xl hover:shadow-gray-200/50",
        className,
      )}
    >
      {/* Header */}
      <header
        className={twMerge(
          "flex flex-col gap-2 mb-6 pb-6 border-b-2 border-gray-100",
        )}
      >
        {/* Heading */}
        <h5 className="text-[20px] font-bold text-dark">{headingText}</h5>

        {/* Paragraph */}
        <p className="text-[14px] text-dark/70">{paragraphText}</p>
      </header>

      {/* Blog posts */}
      {relatedPosts.length > 0 ? (
        <div className="flex flex-col gap-3">
          {relatedPosts.map((post, index) => {
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <Link
                  className={twMerge(
                    "block rounded-xl border-2 border-transparent p-4",
                    "transition-all duration-300",
                    "hover:border-primary-purple/30",
                    "hover:bg-primary-purple/5",
                    "hover:shadow-md",
                    "group",
                  )}
                  href={post.href}
                  prefetch={true}
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <figure
                      className={twMerge(
                        "relative w-20 h-20 shrink-0 overflow-hidden",
                        "rounded-xl border-2 border-gray-100",
                        "transition-all duration-300",
                        "group-hover:border-primary-purple/50",
                      )}
                    >
                      {post.image?.url ? (
                        <Image
                          className={twMerge(
                            "object-cover transition-transform duration-300",
                            "group-hover:scale-110",
                          )}
                          src={`${
                            process.env.NEXT_PUBLIC_SERVER_URL
                          }${post.image.url}`}
                          alt={post.image.alt || post.title}
                          fill={true}
                          sizes="80px"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className={twMerge(
                            "absolute inset-0",
                            "bg-linear-to-br from-gray-200 to-gray-300",
                          )}
                        />
                      )}
                    </figure>

                    {/* Content */}
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      {/* Title */}
                      <h5
                        className={twMerge(
                          "text-[14px] font-semibold text-dark line-clamp-2",
                          "transition-colors duration-300",
                          "group-hover:text-primary-purple",
                        )}
                      >
                        {post.renderedTitle}
                      </h5>

                      {/* Published at */}
                      {post.renderedDate && (
                        <p
                          className={twMerge(
                            "text-[12px] font-medium text-primary-purple",
                          )}
                        >
                          {post.renderedDate}
                        </p>
                      )}

                      {/* Reading time */}
                      {post.renderedMinRead && (
                        <p className="text-[12px] text-gray-500">
                          {post.renderedMinRead}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          {/* No blog posts */}
          <p className="text-[14px] text-gray-500">{noPostsText}</p>
        </div>
      )}
    </motion.aside>
  );
};

export default BlogSidebar;

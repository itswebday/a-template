"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { Media } from "@/payload-types";

type BlogPostClientProps = {
  image: Media | null;
  publishedDate: string | null;
  minRead?: number | null;
  minReadText: string;
  renderedContent: ReactNode;
  publishedOnText: string;
  publishedAt?: string | null;
};

const BlogPostClient: React.FC<BlogPostClientProps> = ({
  image,
  publishedDate,
  minRead,
  minReadText,
  renderedContent,
  publishedOnText,
  publishedAt,
}) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={twMerge(
        "w-full overflow-hidden rounded-3xl border-2 border-gray-100 bg-white",
        "shadow-lg shadow-gray-100/50",
        "transition-all duration-300",
        "hover:shadow-xl hover:shadow-gray-200/50",
      )}
    >
      {/* Image */}
      <figure
        className={twMerge(
          "relative w-full aspect-21/9 overflow-hidden",
          "bg-linear-to-br from-gray-100 to-gray-200",
        )}
      >
        {image?.url ? (
          <Image
            className="object-cover"
            src={`${process.env.NEXT_PUBLIC_SERVER_URL}${image.url}`}
            alt={image.alt || ""}
            fill={true}
            sizes="(max-width: 1100px) 100vw, 768px"
            priority={true}
          />
        ) : (
          <div
            className={twMerge(
              "absolute inset-0",
              "bg-linear-to-br from-primary-purple/10 to-primary-purple/5",
            )}
          />
        )}
      </figure>

      {/* Content */}
      <div className={twMerge("flex flex-col gap-6 p-6", "de:p-8", "lg:p-10")}>
        {/* Blog post meta information */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Published at */}
          {publishedDate && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-purple rounded-full" />
              <span className="text-[14px] font-medium text-primary-purple">
                {publishedDate}
              </span>
            </div>
          )}

          {/* Reading time */}
          {minRead && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-300 rounded-full" />
              <span className="text-[14px] text-gray-600">
                {minRead} {minReadText}
              </span>
            </div>
          )}
        </div>

        {/* Blog post content */}
        <div
          className={twMerge(
            "prose prose-lg max-w-none",
            "prose-headings:text-dark prose-p:text-dark/80",
            "prose-a:text-primary-purple prose-a:no-underline",
            "hover:prose-a:underline prose-strong:text-dark",
            "prose-code:text-primary-purple",
          )}
        >
          {renderedContent}
        </div>

        {/* Published at footer */}
        {publishedAt && (
          <div
            className={twMerge(
              "pt-6 mt-6 text-[14px] text-gray-500 border-t-2 border-gray-100",
            )}
          >
            {publishedOnText}{" "}
            <span className="font-medium text-dark">{publishedDate}</span>
          </div>
        )}
      </div>
    </motion.article>
  );
};

export default BlogPostClient;

import type { LocaleOption } from "@/types";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type BlogPostHeaderProps = {
  title: string;
  locale: LocaleOption;
};

const BlogPostHeader = async ({ title, locale }: BlogPostHeaderProps) => {
  const blogT = await getTranslations("blog");

  return (
    <header
      className={`
        relative bg-black text-white py-16 de:py-32 overflow-hidden
      `}
    >
      {/* Animated background gradients */}
      <div
        className={`
          absolute inset-0 bg-linear-to-br from-gray-900/30 via-black
          to-gray-800/20
        `}
      />
      <div
        className={`
          absolute inset-0 bg-linear-to-tl from-gray-600/10 via-transparent
          to-gray-400/5
        `}
      />

      {/* Floating orbs */}
      <div
        className={`
          absolute top-20 left-10 w-32 h-32 bg-gray-500/10 rounded-full blur-xl
          animate-pulse
        `}
      />
      <div
        className={`
          absolute top-40 right-20 w-24 h-24 bg-gray-400/15 rounded-full
          blur-lg animate-bounce
        `}
        style={{ animationDelay: "1s" }}
      />
      <div
        className={`
          absolute bottom-20 left-1/4 w-16 h-16 bg-gray-600/20 rounded-full
          blur-md animate-pulse
        `}
        style={{ animationDelay: "2s" }}
      />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              url("data:image/svg+xml,%3Csvg width='60' height='60'
              viewBox='0 0 60 60'
              xmlns='http://www.w3.org/2000/svg'%3E%3Cg
              fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'
              fill-opacity='0.05'%3E%3Ccircle
              cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
            `,
            backgroundRepeat: "repeat",
          }}
        />
      </div>

      {/* Geometric shapes */}
      <div
        className={`
          absolute top-32 right-1/4 w-2 h-2 bg-gray-400 rounded-full
          animate-ping
        `}
      />
      <div
        className={`
          absolute top-48 left-1/3 w-1 h-1 bg-gray-300 rounded-full animate-ping
        `}
        style={{ animationDelay: "0.5s" }}
      />
      <div
        className={`
          absolute bottom-32 right-1/3 w-1.5 h-1.5 bg-gray-500 rounded-full
          animate-ping
        `}
        style={{ animationDelay: "1.5s" }}
      />

      {/* Content */}
      <div className="z-10 relative flex flex-col items-center gap-8 mx-auto">
        {/* Back to overview */}
        <Link className="underline" href={blogT("href")} prefetch={true}>
          {blogT("backToOverview")}
        </Link>

        {/* Heading */}
        <h1 className="font-semibold">{title}</h1>
      </div>
    </header>
  );
};

export default BlogPostHeader;

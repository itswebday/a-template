import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type {
  Blog,
  BlogPost,
  CookiePolicy,
  Home,
  Page,
  PrivacyPolicy,
  TermsAndCondition,
} from "@/payload-types";
import { DEFAULT_LOCALE } from "@/constants";

type DocWithMeta =
  | Home
  | Page
  | Blog
  | BlogPost
  | CookiePolicy
  | PrivacyPolicy
  | TermsAndCondition;

export const getMetadata = async (args: {
  doc: DocWithMeta | null;
  locale?: string;
  openGraphType?: "website" | "article";
  publishedTime?: string;
}): Promise<Metadata> => {
  const { doc, locale, openGraphType = "website", publishedTime } = args || {};

  if (!doc) {
    const pageNotFoundT = await getTranslations("pageNotFound");

    return {
      title: pageNotFoundT("title"),
    };
  }

  const ogImage =
    typeof doc?.meta?.image === "object" &&
    doc.meta.image !== null &&
    "url" in doc.meta.image &&
    `${process.env.NEXT_PUBLIC_SERVER_URL}${doc.meta.image.url}`;
  const openGraph: NonNullable<Metadata["openGraph"]> = {
    type: openGraphType,
    title: doc?.meta?.title || "",
    description: doc?.meta?.description ?? undefined,
    images: ogImage ? [{ url: ogImage }] : undefined,
    url: doc.url || `${locale === DEFAULT_LOCALE ? "" : `/${locale}`}`,
    ...(openGraphType === "article" && publishedTime ? { publishedTime } : {}),
  };

  return {
    title: doc?.meta?.title,
    description: doc?.meta?.description,
    openGraph,
  };
};

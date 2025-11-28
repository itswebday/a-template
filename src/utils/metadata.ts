import type { Home, Page } from "@/payload-types";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type DocWithMeta = Home | Page;

export const getMetadata = async (args: {
  doc: DocWithMeta | null;
  locale?: string;
}): Promise<Metadata> => {
  const { doc } = args || {};

  if (!doc) {
    const pageNotFoundT = await getTranslations("pageNotFound");

    return {
      title: pageNotFoundT("title"),
    };
  }

  const title =
    doc?.meta?.title || ("title" in doc ? (doc.title as string) : "") || "";
  const description = doc?.meta?.description ?? undefined;
  const ogImage =
    typeof doc?.meta?.image === "object" &&
    doc.meta.image !== null &&
    "url" in doc.meta.image &&
    `${process.env.NEXT_PUBLIC_SERVER_URL}${doc.meta.image.url}`;
  const url =
    "url" in doc
      ? Array.isArray(doc.url)
        ? doc.url[0] || "/"
        : doc.url || "/"
      : "/";

  return {
    title: doc?.meta?.title,
    description: doc?.meta?.description,
    openGraph: {
      type: "website",
      title: doc?.meta?.title || "",
      description: doc?.meta?.description ?? undefined,
      images: ogImage ? [{ url: ogImage }] : undefined,
      url: url,
    },
  };
};

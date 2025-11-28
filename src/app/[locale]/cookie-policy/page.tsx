import { PageWrapper } from "@/components";
import { RichTextRenderer } from "@/components/server";
import type { LocaleOption, RichText } from "@/types";
import { getGlobal } from "@/utils/server";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const CookiePolicyPage = async () => {
  const locale = (await getLocale()) as LocaleOption;
  const cookiePolicyT = await getTranslations("cookiePolicy");
  const cookiePolicy = await getGlobal("cookiePolicy", locale);

  if (!cookiePolicy) {
    notFound();
  }

  const url =
    typeof cookiePolicy === "object" &&
    cookiePolicy !== null &&
    "url" in cookiePolicy &&
    cookiePolicy.url
      ? Array.isArray(cookiePolicy.url)
        ? cookiePolicy.url[0]
        : cookiePolicy.url
      : cookiePolicyT("href");

  return (
    <PageWrapper pageLabel={url}>
      <main className="w-full py-12 de:py-20">
        <section className="w-11/12 max-w-300 mx-auto">
          {cookiePolicy &&
            typeof cookiePolicy === "object" &&
            "content" in cookiePolicy &&
            cookiePolicy.content && (
              <RichTextRenderer richText={cookiePolicy.content as RichText} />
            )}
        </section>
      </main>
    </PageWrapper>
  );
};

export default CookiePolicyPage;

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = (await getLocale()) as LocaleOption;
  const cookiePolicyT = await getTranslations("cookiePolicy");
  const cookiePolicy = (await getGlobal("cookiePolicy", locale)) as {
    meta?: {
      title?: string;
      description?: string;
      image?: unknown;
    };
    url?: string | string[];
  } | null;

  const ogImage =
    typeof cookiePolicy?.meta?.image === "object" &&
    cookiePolicy.meta.image !== null &&
    "url" in cookiePolicy.meta.image
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}${cookiePolicy.meta.image.url}`
      : undefined;

  const url =
    cookiePolicy?.url && typeof cookiePolicy.url === "string"
      ? cookiePolicy.url
      : Array.isArray(cookiePolicy?.url) && cookiePolicy.url[0]
        ? cookiePolicy.url[0]
        : cookiePolicyT("href");

  return {
    title: cookiePolicy?.meta?.title,
    description: cookiePolicy?.meta?.description,
    openGraph: {
      type: "website",
      title: cookiePolicy?.meta?.title || "",
      description: cookiePolicy?.meta?.description ?? undefined,
      images: ogImage ? [{ url: ogImage }] : undefined,
      url: url,
    },
  };
};

import { PageWrapper } from "@/components";
import { RichTextRenderer } from "@/components/server";
import type { LocaleOption, RichText } from "@/types";
import { getGlobal } from "@/utils/server";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const PrivacyPolicyPage = async () => {
  const locale = (await getLocale()) as LocaleOption;
  const privacyPolicyT = await getTranslations("privacyPolicy");
  const privacyPolicy = await getGlobal("privacyPolicy", locale);

  if (!privacyPolicy) {
    notFound();
  }

  const url =
    typeof privacyPolicy === "object" &&
    privacyPolicy !== null &&
    "url" in privacyPolicy &&
    privacyPolicy.url
      ? Array.isArray(privacyPolicy.url)
        ? privacyPolicy.url[0]
        : privacyPolicy.url
      : privacyPolicyT("href");

  return (
    <PageWrapper pageLabel={url}>
      <main className="w-full py-12 de:py-20">
        <section className="w-11/12 max-w-300 mx-auto">
          {privacyPolicy &&
            typeof privacyPolicy === "object" &&
            "content" in privacyPolicy &&
            privacyPolicy.content && (
              <RichTextRenderer richText={privacyPolicy.content as RichText} />
            )}
        </section>
      </main>
    </PageWrapper>
  );
};

export default PrivacyPolicyPage;

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = (await getLocale()) as LocaleOption;
  const privacyPolicyT = await getTranslations("privacyPolicy");
  const privacyPolicy = (await getGlobal("privacyPolicy", locale)) as {
    meta?: {
      title?: string;
      description?: string;
      image?: unknown;
    };
    url?: string | string[];
  } | null;

  const ogImage =
    typeof privacyPolicy?.meta?.image === "object" &&
    privacyPolicy.meta.image !== null &&
    "url" in privacyPolicy.meta.image
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}${privacyPolicy.meta.image.url}`
      : undefined;

  const url =
    privacyPolicy?.url && typeof privacyPolicy.url === "string"
      ? privacyPolicy.url
      : Array.isArray(privacyPolicy?.url) && privacyPolicy.url[0]
        ? privacyPolicy.url[0]
        : privacyPolicyT("href");

  return {
    title: privacyPolicy?.meta?.title,
    description: privacyPolicy?.meta?.description,
    openGraph: {
      type: "website",
      title: privacyPolicy?.meta?.title || "",
      description: privacyPolicy?.meta?.description ?? undefined,
      images: ogImage ? [{ url: ogImage }] : undefined,
      url: url,
    },
  };
};

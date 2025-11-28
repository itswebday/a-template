import { PageWrapper } from "@/components";
import { RichTextRenderer } from "@/components/server";
import type { LocaleOption, RichText } from "@/types";
import { getGlobal } from "@/utils/server";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const TermsAndConditionsPage = async () => {
  const locale = (await getLocale()) as LocaleOption;
  const termsAndConditionsT = await getTranslations("termsAndConditions");
  const termsAndConditions = await getGlobal("termsAndConditions", locale);

  if (!termsAndConditions) {
    notFound();
  }

  const url =
    typeof termsAndConditions === "object" &&
    termsAndConditions !== null &&
    "url" in termsAndConditions &&
    termsAndConditions.url
      ? Array.isArray(termsAndConditions.url)
        ? termsAndConditions.url[0]
        : termsAndConditions.url
      : termsAndConditionsT("href");

  return (
    <PageWrapper pageLabel={url}>
      <main className="w-full py-12 de:py-20">
        <section className="w-11/12 max-w-300 mx-auto">
          {termsAndConditions &&
            typeof termsAndConditions === "object" &&
            "content" in termsAndConditions &&
            termsAndConditions.content && (
              <RichTextRenderer
                richText={termsAndConditions.content as RichText}
              />
            )}
        </section>
      </main>
    </PageWrapper>
  );
};

export default TermsAndConditionsPage;

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = (await getLocale()) as LocaleOption;
  const termsAndConditionsT = await getTranslations("termsAndConditions");
  const termsAndConditions = (await getGlobal(
    "termsAndConditions",
    locale,
  )) as {
    meta?: {
      title?: string;
      description?: string;
      image?: unknown;
    };
    url?: string | string[];
  } | null;

  const ogImage =
    typeof termsAndConditions?.meta?.image === "object" &&
    termsAndConditions.meta.image !== null &&
    "url" in termsAndConditions.meta.image
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}${termsAndConditions.meta.image.url}`
      : undefined;

  const url =
    termsAndConditions?.url && typeof termsAndConditions.url === "string"
      ? termsAndConditions.url
      : Array.isArray(termsAndConditions?.url) && termsAndConditions.url[0]
        ? termsAndConditions.url[0]
        : termsAndConditionsT("href");

  return {
    title: termsAndConditions?.meta?.title,
    description: termsAndConditions?.meta?.description,
    openGraph: {
      type: "website",
      title: termsAndConditions?.meta?.title || "",
      description: termsAndConditions?.meta?.description ?? undefined,
      images: ogImage ? [{ url: ogImage }] : undefined,
      url: url,
    },
  };
};

import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { PageWrapper, PreviewListener } from "@/components";
import type { LocaleOption, RichText } from "@/types";
import { getCachedGlobal, getGlobal, getMetadata } from "@/utils/server";
import { CookiePolicy } from "./_ui";

export const revalidate = 86400; // 24 hours in seconds

const CookiePolicyPage = async () => {
  const locale = (await getLocale()) as LocaleOption;
  const draft = await draftMode();
  const cookiePolicy = draft.isEnabled
    ? await getGlobal("cookie-policy", locale, true)
    : await getCachedGlobal("cookie-policy", locale)();

  if (!cookiePolicy) {
    notFound();
  }

  return (
    <PageWrapper pageLabel="cookie-policy">
      <main>
        {draft.isEnabled && <PreviewListener />}
        {cookiePolicy &&
          typeof cookiePolicy === "object" &&
          "content" in cookiePolicy &&
          cookiePolicy.content && (
            <CookiePolicy content={cookiePolicy.content as RichText} />
          )}
      </main>
    </PageWrapper>
  );
};

export default CookiePolicyPage;

export const generateStaticParams = async () => {
  const { LOCALES } = await import("@/constants");
  return LOCALES.map((locale) => ({ locale }));
};

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = (await getLocale()) as LocaleOption;
  const cookiePolicy = await getCachedGlobal("cookie-policy", locale)();

  return getMetadata({ doc: cookiePolicy, locale });
};

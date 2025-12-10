import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { PageWrapper, PreviewListener } from "@/components";
import type { LocaleOption, RichText } from "@/types";
import { getCachedGlobal, getGlobal, getMetadata } from "@/utils/server";
import { PrivacyPolicy } from "./_ui";

export const revalidate = 86400; // 24 hours in seconds

const PrivacyPolicyPage = async () => {
  const locale = (await getLocale()) as LocaleOption;
  const draft = await draftMode();
  const privacyPolicy = draft.isEnabled
    ? await getGlobal("privacy-policy", locale, true)
    : await getCachedGlobal("privacy-policy", locale)();

  if (!privacyPolicy) {
    notFound();
  }

  return (
    <PageWrapper pageLabel="privacy-policy">
      <main>
        {draft.isEnabled && <PreviewListener />}
        {privacyPolicy &&
          typeof privacyPolicy === "object" &&
          "content" in privacyPolicy &&
          privacyPolicy.content && (
            <PrivacyPolicy content={privacyPolicy.content as RichText} />
          )}
      </main>
    </PageWrapper>
  );
};

export default PrivacyPolicyPage;

export const generateStaticParams = async () => {
  const { LOCALES } = await import("@/constants");
  return LOCALES.map((locale) => ({ locale }));
};

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = (await getLocale()) as LocaleOption;
  const privacyPolicy = await getCachedGlobal("privacy-policy", locale)();

  return getMetadata({ doc: privacyPolicy, locale });
};

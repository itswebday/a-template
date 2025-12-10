import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { PageWrapper, PreviewListener } from "@/components";
import type { LocaleOption, RichText } from "@/types";
import { getCachedGlobal, getGlobal, getMetadata } from "@/utils/server";
import { TermsAndConditions } from "./_ui";

export const revalidate = 86400; // 24 hours in seconds

const TermsAndConditionsPage = async () => {
  const locale = (await getLocale()) as LocaleOption;
  const draft = await draftMode();
  const termsAndConditions = draft.isEnabled
    ? await getGlobal("terms-and-conditions", locale, true)
    : await getCachedGlobal("terms-and-conditions", locale)();

  if (!termsAndConditions) {
    notFound();
  }

  return (
    <PageWrapper pageLabel="terms-and-conditions">
      <main>
        {draft.isEnabled && <PreviewListener />}
        {termsAndConditions &&
          typeof termsAndConditions === "object" &&
          "content" in termsAndConditions &&
          termsAndConditions.content && (
            <TermsAndConditions
              content={termsAndConditions.content as RichText}
            />
          )}
      </main>
    </PageWrapper>
  );
};

export default TermsAndConditionsPage;

export const generateStaticParams = async () => {
  const { LOCALES } = await import("@/constants");
  return LOCALES.map((locale) => ({ locale }));
};

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = (await getLocale()) as LocaleOption;
  const termsAndConditions = await getCachedGlobal(
    "terms-and-conditions",
    locale,
  )();

  return getMetadata({ doc: termsAndConditions, locale });
};

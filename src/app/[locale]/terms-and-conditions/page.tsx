import { PageWrapper } from "@/components";
import type { LocaleOption, RichText } from "@/types";
import { getGlobal } from "@/utils/server";
import { getMetadata } from "@/utils/metadata";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { TermsAndConditions } from "./_ui";

export const dynamic = "force-dynamic";

const TermsAndConditionsPage = async () => {
  const locale = (await getLocale()) as LocaleOption;
  const termsAndConditions = await getGlobal("terms-and-conditions", locale);

  if (!termsAndConditions) {
    notFound();
  }

  return (
    <PageWrapper pageLabel="terms-and-conditions">
      <main>
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

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = (await getLocale()) as LocaleOption;
  const termsAndConditions = await getGlobal("terms-and-conditions", locale);

  return getMetadata({ doc: termsAndConditions, locale });
};

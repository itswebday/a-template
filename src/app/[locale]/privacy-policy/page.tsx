import { PageWrapper } from "@/components";
import type { LocaleOption, RichText } from "@/types";
import { getGlobal, getMetadata } from "@/utils/server";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PrivacyPolicy } from "./_ui";

export const dynamic = "force-dynamic";

const PrivacyPolicyPage = async () => {
  const locale = (await getLocale()) as LocaleOption;
  const privacyPolicy = await getGlobal("privacy-policy", locale);

  if (!privacyPolicy) {
    notFound();
  }

  return (
    <PageWrapper pageLabel="privacy-policy">
      <main>
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

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = (await getLocale()) as LocaleOption;
  const privacyPolicy = await getGlobal("privacy-policy", locale);

  return getMetadata({ doc: privacyPolicy, locale });
};

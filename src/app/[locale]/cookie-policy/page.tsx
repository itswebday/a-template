import { PageWrapper } from "@/components";
import type { LocaleOption, RichText } from "@/types";
import { getGlobal, getMetadata } from "@/utils/server";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CookiePolicy } from "./_ui";

export const dynamic = "force-dynamic";

const CookiePolicyPage = async () => {
  const locale = (await getLocale()) as LocaleOption;
  const cookiePolicy = await getGlobal("cookie-policy", locale);

  if (!cookiePolicy) {
    notFound();
  }

  return (
    <PageWrapper pageLabel="cookie-policy">
      <main>
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

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = (await getLocale()) as LocaleOption;
  const cookiePolicy = await getGlobal("cookie-policy", locale);

  return getMetadata({ doc: cookiePolicy, locale });
};

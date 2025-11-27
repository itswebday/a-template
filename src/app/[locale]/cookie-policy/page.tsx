import { RichTextRenderer } from "@/components/server";
import { DEFAULT_LOCALE } from "@/constants";
import { LocaleOption, RichText } from "@/types";
import { getGlobal } from "@/utils/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

type CookiePolicyPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const CookiePolicyPage = async ({ params }: CookiePolicyPageProps) => {
  const { locale = DEFAULT_LOCALE } = await params;
  const cookiePolicy = await queryCookiePolicy({
    locale: locale,
  });

  if (!cookiePolicy) {
    notFound();
  }

  return (
    <main className="w-full py-12 de:py-20">
      {/* Container */}
      <section className="w-11/12 max-w-300 mx-auto">
        {/* Content */}
        {cookiePolicy.content && (
          <RichTextRenderer richText={cookiePolicy.content as RichText} />
        )}
      </section>
    </main>
  );
};

export default CookiePolicyPage;

export const generateMetadata = async ({
  params,
}: CookiePolicyPageProps): Promise<Metadata> => {
  const { locale = DEFAULT_LOCALE } = await params;
  const cookiePolicyT = await getTranslations({
    locale,
    namespace: "cookiePolicy",
  });

  return {
    title: cookiePolicyT("title"),
    description: cookiePolicyT("description"),
  };
};

const queryCookiePolicy = async ({ locale }: { locale: string }) => {
  try {
    const cookiePolicy = await getGlobal(
      "cookiePolicy",
      locale as LocaleOption,
    );
    return cookiePolicy;
  } catch (err) {
    console.error(err);

    return null;
  }
};

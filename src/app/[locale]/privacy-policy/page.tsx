import { RichTextRenderer } from "@/components/server";
import { DEFAULT_LOCALE } from "@/constants";
import { LocaleOption, RichText } from "@/types";
import { getGlobal } from "@/utils/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

type PrivacyPolicyPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const PrivacyPolicyPage = async ({ params }: PrivacyPolicyPageProps) => {
  const { locale = DEFAULT_LOCALE } = await params;
  const privacyPolicy = await queryPrivacyPolicy({
    locale: locale,
  });

  if (!privacyPolicy) {
    notFound();
  }

  return (
    <main className="w-full py-12 de:py-20">
      {/* Container */}
      <section className="container-medium w-11/12 mx-auto">
        {/* Content */}
        {privacyPolicy.content && (
          <RichTextRenderer richText={privacyPolicy.content as RichText} />
        )}
      </section>
    </main>
  );
};

export default PrivacyPolicyPage;

export const generateMetadata = async ({
  params,
}: PrivacyPolicyPageProps): Promise<Metadata> => {
  const { locale = DEFAULT_LOCALE } = await params;
  const privacyPolicyT = await getTranslations({
    locale,
    namespace: "privacyPolicy",
  });

  return {
    title: privacyPolicyT("title"),
    description: privacyPolicyT("description"),
  };
};

const queryPrivacyPolicy = async ({ locale }: { locale: string }) => {
  try {
    const privacyPolicy = await getGlobal(
      "privacyPolicy",
      locale as LocaleOption,
    );
    return privacyPolicy;
  } catch (err) {
    console.error(err);

    return null;
  }
};

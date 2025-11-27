import { RichTextRenderer } from "@/components/server";
import { DEFAULT_LOCALE } from "@/constants";
import { LocaleOption, RichText } from "@/types";
import { getGlobal } from "@/utils/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

type TermsAndConditionsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const TermsAndConditionsPage = async ({
  params,
}: TermsAndConditionsPageProps) => {
  const { locale = DEFAULT_LOCALE } = await params;
  const termsAndConditions = await queryTermsAndConditions({
    locale: locale,
  });

  if (!termsAndConditions) {
    notFound();
  }

  return (
    <main className="w-full py-12 de:py-20">
      <section className="w-11/12 max-w-300 mx-auto">
        {/* Content */}
        {termsAndConditions.content && (
          <RichTextRenderer richText={termsAndConditions.content as RichText} />
        )}
      </section>
    </main>
  );
};

export default TermsAndConditionsPage;

export const generateMetadata = async ({
  params,
}: TermsAndConditionsPageProps): Promise<Metadata> => {
  const { locale = DEFAULT_LOCALE } = await params;
  const termsAndConditionsT = await getTranslations({
    locale,
    namespace: "termsAndConditions",
  });

  return {
    title: termsAndConditionsT("title"),
    description: termsAndConditionsT("description"),
  };
};

const queryTermsAndConditions = async ({ locale }: { locale: string }) => {
  try {
    const termsAndConditions = await getGlobal(
      "termsAndConditions",
      locale as LocaleOption,
    );
    return termsAndConditions;
  } catch (err) {
    console.error(err);

    return null;
  }
};

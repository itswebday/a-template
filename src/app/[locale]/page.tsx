import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { blockComponents } from "@/blocks";
import { PageWrapper, PreviewListener } from "@/components";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import type { LocaleOption } from "@/types";
import { getCachedGlobal, getGlobal, getMetadata } from "@/utils/server";

export const revalidate = 3600; // 1 hour in seconds

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const HomePage = async ({ params }: HomePageProps) => {
  const draft = await draftMode();
  const { locale = DEFAULT_LOCALE } = await params;

  if (!LOCALES.includes(locale as LocaleOption)) {
    return notFound();
  }

  const homepage = draft.isEnabled
    ? await getGlobal("home", locale as LocaleOption, true)
    : await getCachedGlobal("home", locale as LocaleOption)();

  const blocks = homepage?.blocks;

  return (
    <PageWrapper pageLabel="home">
      <main>
        {draft.isEnabled && <PreviewListener />}
        {blocks && Array.isArray(blocks) && blocks.length > 0 && (
          <>
            {blocks.map((block, index) => {
              const BlockComponent = blockComponents[
                block.blockType
              ] as React.ComponentType<typeof block>;

              if (BlockComponent) {
                return <BlockComponent key={index} {...block} />;
              }

              return null;
            })}
          </>
        )}
      </main>
    </PageWrapper>
  );
};

export default HomePage;

export const generateMetadata = async ({
  params,
}: HomePageProps): Promise<Metadata> => {
  const { locale = DEFAULT_LOCALE } = await params;
  const pageNotFoundT = await getTranslations("pageNotFound");

  if (!LOCALES.includes(locale as LocaleOption)) {
    return {
      title: pageNotFoundT("title"),
    };
  }
  // Use cached global for metadata generation
  const homepage = await getCachedGlobal("home", locale as LocaleOption)();

  return getMetadata({ doc: homepage, locale });
};

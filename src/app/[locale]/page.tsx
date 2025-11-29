import { PageWrapper, PreviewListener } from "@/components";
import { blockComponents } from "@/blocks";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import type { LocaleOption } from "@/types";
import { getGlobal, getMetadata } from "@/utils/server";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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

  const homepage = await getGlobal(
    "home",
    locale as LocaleOption,
    draft.isEnabled,
  );

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
  const homepage = await getGlobal("home", locale as LocaleOption, false);

  return getMetadata({ doc: homepage, locale });
};

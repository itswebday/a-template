import { PageWrapper, PreviewListener } from "@/components";
import { blockComponents } from "@/blocks";
import { DEFAULT_LOCALE } from "@/constants";
import { getGlobal } from "@/utils/globals";
import { LocaleOption } from "@/types";
import { draftMode } from "next/headers";
import React from "react";

export const dynamic = "force-dynamic";

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const HomePage = async ({ params }: HomePageProps) => {
  const draft = await draftMode();
  const { locale = DEFAULT_LOCALE } = await params;
  const homepage = await getGlobal(
    "homepage",
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

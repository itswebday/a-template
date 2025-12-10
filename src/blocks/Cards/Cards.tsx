import { getLocale } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import { Card } from "@/components";
import { RichTextRenderer } from "@/components/server";
import type { CardsBlock } from "@/payload-types";
import type { LocaleOption, RichText } from "@/types";
import { getButtonHref, getPaddingClasses } from "@/utils";
import { getCachedGlobals } from "@/utils/server";

type CardItem =
  NonNullable<CardsBlock["cards"]> extends Array<infer T> ? T : never;

const Cards: React.FC<CardsBlock> = async ({
  cards,
  dark,
  paddingTop,
  paddingBottom,
}) => {
  const locale = (await getLocale()) as LocaleOption;
  const globals = await getCachedGlobals(locale)();

  return (
    <section
      className={twMerge(
        "w-full overflow-hidden",
        dark && "bg-dark text-white",
        getPaddingClasses(paddingTop, paddingBottom),
      )}
    >
      {/* Container */}
      <div className="w-11/12 max-w-7xl mx-auto">
        <div className="flex flex-col gap-8 md:gap-12">
          {cards && cards.length > 0 && (
            <div
              className={twMerge(
                "grid grid-cols-1 items-stretch gap-6",
                "md:grid-cols-2 md:gap-8",
                "lg:grid-cols-3",
              )}
            >
              {cards.map((card: CardItem, index) => {
                const buttonHref = card.showButton
                  ? getButtonHref(card.button, globals)
                  : null;
                const renderedText = card.text ? (
                  <RichTextRenderer
                    richText={card.text as RichText}
                    globals={globals}
                  />
                ) : null;

                return (
                  <Card
                    key={card.id || index}
                    icon={
                      typeof card.icon === "object" &&
                      card.icon !== null &&
                      "url" in card.icon
                        ? card.icon
                        : null
                    }
                    renderedText={renderedText}
                    button={
                      card.showButton && buttonHref && card.button?.text
                        ? {
                            text: card.button.text,
                            href: buttonHref,
                            variant: card.button.variant,
                            centered: card.button.centered || false,
                            newTab: card.button.newTab,
                          }
                        : null
                    }
                    delay={0.3 + index * 0.1}
                    dark={dark}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Cards;

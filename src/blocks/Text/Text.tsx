import { getLocale } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import { type ButtonLinkProps } from "@/components";
import { SectionContent } from "@/components/server";
import type { TextBlock } from "@/payload-types";
import type { LocaleOption } from "@/types";
import { getButtonHref, getPaddingClasses } from "@/utils";
import { getCachedGlobals } from "@/utils/server";

const Text: React.FC<TextBlock> = async ({
  showHeading,
  heading,
  text,
  showButton,
  button,
  width,
  dark,
  paddingTop,
  paddingBottom,
}) => {
  const locale = (await getLocale()) as LocaleOption;
  const globals = await getCachedGlobals(locale)();
  const buttonHref = showButton ? getButtonHref(button, globals) : null;

  const getMaxWidthClass = () => {
    switch (width) {
      case "small":
        return "max-w-120";
      case "medium":
        return "max-w-240";
      case "large":
        return "max-w-320";
      default:
        return "max-w-240";
    }
  };

  return (
    <section
      className={twMerge(
        "w-full overflow-hidden",
        dark && "bg-dark text-white",
        getPaddingClasses(paddingTop, paddingBottom),
      )}
    >
      {/* Container */}
      <div className={twMerge("w-11/12 max-w-7xl mx-auto", getMaxWidthClass())}>
        {/* Section content */}
        <SectionContent
          heading={
            showHeading && heading
              ? {
                  heading: {
                    icon: heading.icon,
                    text: heading.text,
                    centered: heading.centered,
                  },
                  tagName: "h5",
                  iconSize: "small",
                }
              : undefined
          }
          text={text || undefined}
          button={
            showButton && button && buttonHref
              ? {
                  href: buttonHref,
                  variant: button.variant as ButtonLinkProps["variant"],
                  target: button.newTab ? "_blank" : "_self",
                  children: button.text || "",
                }
              : undefined
          }
          centeredButton={button?.centered || false}
          dark={dark || false}
          useAnimations={true}
          globals={globals}
        />
      </div>
    </section>
  );
};

export default Text;

import { getLocale } from "next-intl/server";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { ButtonLink, type ButtonLinkProps } from "@/components";
import { AnimatedWrapper } from "@/components/animations";
import { RichTextRenderer } from "@/components/server";
import type { TextBlock } from "@/payload-types";
import type { LocaleOption, RichText } from "@/types";
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
      <div className="w-11/12 max-w-7xl mx-auto">
        <div
          className={twMerge(
            "flex flex-col gap-6 w-fit",
            getMaxWidthClass(),
            heading?.centered ? "mx-auto" : "mr-auto",
          )}
        >
          {showHeading && heading && (heading.icon || heading.text) && (
            <AnimatedWrapper delay={0} direction="up">
              {/* Heading */}
              <div
                className={twMerge(
                  "flex items-center gap-3",
                  heading.centered && "justify-center",
                )}
              >
                {heading.icon &&
                  typeof heading.icon === "object" &&
                  heading.icon !== null &&
                  "url" in heading.icon && (
                    <span className="relative block h-5 w-5 shrink-0">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SERVER_URL}${
                          heading.icon.url
                        }`}
                        alt={heading.icon.alt || ""}
                        fill={true}
                        className="object-contain"
                        sizes="24px"
                      />
                    </span>
                  )}
                {heading.text && (
                  <h5 className="font-semibold text-primary-purple">
                    {heading.text}
                  </h5>
                )}
              </div>
            </AnimatedWrapper>
          )}

          {text && (
            <AnimatedWrapper delay={0.1} direction="up">
              {/* Text */}
              <div
                className={twMerge(
                  "text-[15px] leading-relaxed",
                  dark ? "text-white/90" : "text-dark/90",
                )}
              >
                <RichTextRenderer
                  richText={text as RichText}
                  globals={globals}
                />
              </div>
            </AnimatedWrapper>
          )}

          {showButton && buttonHref && button?.text && (
            <AnimatedWrapper delay={0.2} direction="up">
              {/* Button */}
              <div className={twMerge("w-fit", button.centered && "mx-auto")}>
                <ButtonLink
                  href={buttonHref}
                  variant={button.variant as ButtonLinkProps["variant"]}
                  target={button.newTab ? "_blank" : "_self"}
                >
                  {button.text}
                </ButtonLink>
              </div>
            </AnimatedWrapper>
          )}
        </div>
      </div>
    </section>
  );
};

export default Text;

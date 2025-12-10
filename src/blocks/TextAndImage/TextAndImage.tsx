import { getLocale } from "next-intl/server";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { ButtonLink, type ButtonLinkProps } from "@/components";
import { AnimatedFigure, AnimatedWrapper } from "@/components/animations";
import { RichTextRenderer } from "@/components/server";
import type { TextAndImageBlock } from "@/payload-types";
import type { LocaleOption, RichText } from "@/types";
import { getButtonHref, getPaddingClasses } from "@/utils";
import { getCachedGlobals } from "@/utils/server";

const TextAndImage: React.FC<TextAndImageBlock> = async ({
  showHeading,
  heading,
  text,
  showButton,
  button,
  image,
  imageSide,
  width,
  dark,
  paddingTop,
  paddingBottom,
}) => {
  const locale = (await getLocale()) as LocaleOption;
  const globals = await getCachedGlobals(locale)();
  const buttonHref = showButton ? getButtonHref(button, globals) : null;

  // Get max width class
  const getMaxWidthClass = () => {
    switch (width) {
      case "small":
        return "max-w-240";
      case "medium":
        return "max-w-320";
      case "large":
        return "max-w-400";
      default:
        return "max-w-320";
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
      <div className={twMerge("w-11/12 mx-auto", getMaxWidthClass())}>
        <div className={twMerge("flex flex-col gap-8", "de:gap-12")}>
          <div
            className={twMerge(
              "flex flex-col gap-8 de:gap-0 de:items-center",
              imageSide === "left" ? "de:flex-row" : "de:flex-row-reverse",
            )}
          >
            {/* Text content */}
            <div
              className={twMerge(
                "flex-1 flex flex-col de:justify-center gap-6",
                imageSide === "left" ? "de:pr-16 de:pl-0" : "de:pl-16 de:pr-0",
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
                      "text-[15px] leading-relaxed -mt-1",
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
                  <div
                    className={twMerge("w-fit", button.centered && "mx-auto")}
                  >
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

            {/* Image */}
            <div
              className={twMerge(
                "flex-1 relative",
                imageSide === "left" ? "de:pl-8 de:pr-0" : "de:pr-16 de:pl-0",
              )}
            >
              {image &&
                typeof image === "object" &&
                image !== null &&
                "url" in image &&
                image.url && (
                  <AnimatedFigure
                    delay={0.2}
                    imageLeft={imageSide === "left"}
                    className={twMerge(
                      "relative w-full aspect-square overflow-hidden",
                      "rounded-[25px]",
                    )}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SERVER_URL}${
                        image.url as string
                      }`}
                      alt={
                        ("alt" in image &&
                          image.alt &&
                          typeof image.alt === "string" &&
                          image.alt) ||
                        ""
                      }
                      fill={true}
                      className="object-cover"
                      sizes="(max-width: 900px) 100vw, 50vw"
                      loading="lazy"
                    />
                  </AnimatedFigure>
                )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextAndImage;

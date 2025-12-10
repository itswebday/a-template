import { getLocale } from "next-intl/server";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { AnimatedFigure } from "@/components/animations";
import { type ButtonLinkProps } from "@/components";
import { SectionContent } from "@/components/server";
import type { TextAndImageBlock } from "@/payload-types";
import type { LocaleOption } from "@/types";
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
      <div
        className={twMerge(
          "flex flex-col gap-8 w-11/12 mx-auto",
          getMaxWidthClass(),
          "de:flex-row de:items-center de:gap-12",
          imageSide === "left" ? "de:flex-row-reverse" : "",
        )}
      >
        {/* Section content */}
        <div
          className={twMerge(
            "flex flex-col flex-1",
            "de:justify-center",
            imageSide === "left" ? "de:pr-16 de:pl-0" : "de:pl-16 de:pr-0",
          )}
        >
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
            dark={dark || false}
            useAnimations={true}
            globals={globals}
          />
        </div>

        {/* Image */}
        <div
          className={twMerge(
            "relative flex-1",
            imageSide === "left" ? "de:pl-8 de:pr-0" : "de:pr-16 de:pl-0",
          )}
        >
          {image &&
            typeof image === "object" &&
            image !== null &&
            "url" in image &&
            image.url && (
              <AnimatedFigure
                className={twMerge(
                  "relative w-full aspect-square",
                  "overflow-hidden rounded-[25px]",
                )}
                delay={0.2}
                imageLeft={imageSide === "left"}
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
    </section>
  );
};

export default TextAndImage;

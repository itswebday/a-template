import { getLocale } from "next-intl/server";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { ButtonLink, type ButtonLinkProps } from "@/components";
import { RichTextRenderer } from "@/components/server";
import type { FormBlock, Media } from "@/payload-types";
import type { LocaleOption, RichText } from "@/types";
import { getButtonHref, getPaddingClasses } from "@/utils";
import { getCollection } from "@/utils/collections";
import { getCachedGlobals } from "@/utils/server";
import FormAnimatedBackground from "./FormAnimatedBackground";
import { FormClient } from "./FormClient";

const Form: React.FC<FormBlock> = async ({
  form,
  fullScreen,
  showHeading,
  heading,
  text,
  showButton,
  button,
  formSide,
  dark,
  paddingTop,
  paddingBottom,
}) => {
  const locale = (await getLocale()) as LocaleOption;
  const globals = await getCachedGlobals(locale)();
  const buttonHref = showButton ? getButtonHref(button, globals) : null;

  // Form ID
  const formId =
    typeof form === "object" && form !== null && "id" in form
      ? (form.id as number)
      : typeof form === "number"
        ? form
        : null;

  // Form data
  const allForms = formId
    ? await getCollection("forms", locale, {
        filters: [{ field: "id", operator: "equals", value: formId }],
      })
    : [];
  const formData = allForms.length > 0 ? allForms[0] : null;

  // Rendered text
  const renderedText = text ? (
    <RichTextRenderer richText={text as RichText} globals={globals} />
  ) : null;

  // Rendered button
  const renderedButton =
    showButton && buttonHref && button?.text ? (
      <div className={twMerge("w-fit", button.centered && "mx-auto")}>
        <ButtonLink
          href={buttonHref}
          variant={button.variant as ButtonLinkProps["variant"]}
          target={button.newTab ? "_blank" : "_self"}
        >
          {button.text}
        </ButtonLink>
      </div>
    ) : null;

  // Rendered form
  const renderedForm =
    formData && formId ? (
      <FormClient
        form={formData}
        formId={formId}
        dark={dark}
        fullScreen={fullScreen || false}
        globals={globals}
      />
    ) : null;

  if (fullScreen) {
    return (
      <section
        className={twMerge(
          "relative w-full overflow-visible",
          getPaddingClasses(paddingTop, paddingBottom),
        )}
      >
        {/* Animated background */}
        <FormAnimatedBackground />

        {/* Container */}
        <div className="z-10 relative w-11/12 max-w-7xl mx-auto">
          {renderedForm && <div>{renderedForm}</div>}
        </div>
      </section>
    );
  }

  // Heading icon media
  const headingIconMedia =
    heading?.icon &&
    typeof heading.icon === "object" &&
    heading.icon !== null &&
    "url" in heading.icon
      ? (heading.icon as Media)
      : null;

  return (
    <section
      className={twMerge(
        "relative w-full overflow-visible",
        getPaddingClasses(paddingTop, paddingBottom),
      )}
    >
      {/* Animated background */}
      <FormAnimatedBackground />

      {/* Container */}
      <div
        className={twMerge(
          "z-10 relative w-full max-w-6xl mx-auto",
          "de:w-11/12",
        )}
      >
        <div className={twMerge("flex flex-col gap-8", "de:gap-12")}>
          <div
            className={twMerge(
              "flex flex-col gap-8",
              "de:gap-0 de:grid de:grid-cols-2 de:items-center",
            )}
          >
            {/* Text content */}
            <div
              className={twMerge(
                "flex-1 flex flex-col gap-6 de:justify-center",
                formSide === "left"
                  ? "de:order-1 de:pr-16"
                  : "de:order-2 de:pl-16",
              )}
            >
              {showHeading && (headingIconMedia || heading?.text) && (
                <div
                  className={twMerge(
                    "flex items-center gap-3",
                    heading?.centered && "justify-center",
                  )}
                >
                  {headingIconMedia && (
                    <span
                      className={twMerge(
                        "relative block h-6 w-6 shrink-0",
                        "transition-transform duration-300 hover:scale-110",
                      )}
                    >
                      <Image
                        className="object-contain"
                        src={`${process.env.NEXT_PUBLIC_SERVER_URL}${
                          headingIconMedia.url
                        }`}
                        alt={
                          ("alt" in headingIconMedia && headingIconMedia.alt) ||
                          ""
                        }
                        fill={true}
                        sizes="24px"
                      />
                    </span>
                  )}

                  {heading?.text && (
                    <h2
                      className={twMerge(
                        "text-[24px] font-bold",
                        "bg-linear-to-r from-primary-purple to-primary-lightpurple",
                        "bg-clip-text text-transparent",
                        "md:text-[30px]",
                        "lg:text-[36px]",
                      )}
                    >
                      {heading.text}
                    </h2>
                  )}
                </div>
              )}

              {renderedText && (
                <div
                  className={twMerge(
                    "text-[15px] leading-relaxed text-dark/80",
                    "md:text-[16px]",
                  )}
                >
                  {renderedText}
                </div>
              )}

              {formData?.description && (
                <div
                  className={twMerge(
                    "text-[14px] leading-relaxed italic pl-4 py-2 text-dark/80",
                    "bg-primary-purple/5 border-l-4 border-primary-purple/30",
                    "rounded-r-[30px]",
                    "md:text-[16px]",
                  )}
                >
                  {formData.description}
                </div>
              )}

              {renderedButton && <div className="pt-2">{renderedButton}</div>}
            </div>

            {/* Form */}
            <div
              className={twMerge(
                "flex-1",
                formSide === "left"
                  ? "de:order-2 de:pl-8"
                  : "de:order-1 de:pr-8",
              )}
            >
              <div className="relative">
                {/* Decorative gradient background */}
                <div
                  className={twMerge(
                    "absolute inset-0",
                    "bg-linear-to-br from-primary-purple/20",
                    "to-primary-lightpurple/10",
                    "rounded-[50px] opacity-20 blur-3xl",
                  )}
                />
                <div className="relative">{renderedForm}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Form;

import { getLocale } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import { type ButtonLinkProps } from "@/components";
import { AnimatedBackground } from "@/components/animations";
import { SectionContent } from "@/components/server";
import type { FormBlock } from "@/payload-types";
import type { LocaleOption } from "@/types";
import { getButtonHref, getPaddingClasses } from "@/utils";
import { getCollection } from "@/utils/collections";
import { getCachedGlobals } from "@/utils/server";
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
          dark ? "bg-dark" : "bg-white",
          getPaddingClasses(paddingTop, paddingBottom),
        )}
      >
        {/* Animated background */}
        <AnimatedBackground dark={dark || false} />

        {/* Container */}
        <div className="z-10 relative w-11/12 max-w-7xl mx-auto">
          {renderedForm}
        </div>
      </section>
    );
  }

  return (
    <section
      className={twMerge(
        "relative w-full overflow-visible",
        dark ? "bg-dark" : "bg-white",
        getPaddingClasses(paddingTop, paddingBottom),
      )}
    >
      {/* Animated background */}
      <AnimatedBackground dark={dark || false} />

      {/* Container */}
      <div
        className={twMerge(
          "z-10 relative flex flex-col gap-8 w-11/12 mx-auto",
          "de:flex-row de:items-center de:gap-12",
          formSide === "left" ? "de:flex-row-reverse" : "",
        )}
      >
        {/* Section content */}
        <div
          className={twMerge(
            "flex flex-col flex-1",
            "de:justify-center",
            formSide === "left" ? "de:pr-8 de:pl-0" : "de:pl-8 de:pr-0",
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
                    tagName: "h2",
                    iconSize: "large",
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

        {/* Form */}
        <div
          className={twMerge(
            "relative flex-1",
            formSide === "left" ? "de:pl-8 de:pr-0" : "de:pr-8 de:pl-0",
          )}
        >
          <div className="relative">{renderedForm}</div>
        </div>
      </div>
    </section>
  );
};

export default Form;

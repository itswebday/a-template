"use server";

import { twMerge } from "tailwind-merge";
import { ButtonLink, type ButtonLinkProps } from "@/components";
import { AnimatedWrapper } from "@/components/animations";
import {
  RichTextRenderer,
  SectionHeading,
  type SectionHeadingProps,
} from "@/components/server";
import type { RichText } from "@/types";
import type { getGlobals } from "@/utils/server";

type SectionContentProps = {
  className?: string;
  heading?: SectionHeadingProps;
  text?: RichText;
  button?: ButtonLinkProps;
  centeredButton?: boolean;
  dark?: boolean;
  useAnimations?: boolean;
  globals: Awaited<ReturnType<typeof getGlobals>>;
};

const SectionContent: React.FC<SectionContentProps> = ({
  className,
  heading,
  text,
  button,
  centeredButton = false,
  dark,
  useAnimations = false,
  globals,
}) => {
  // Heading component
  const headingElement = heading ? <SectionHeading {...heading} /> : null;

  // Text component
  const textElement = text ? (
    <div
      className={twMerge(
        "text-[15px] leading-relaxed",
        dark ? "text-white/90" : "text-dark/90",
      )}
    >
      <RichTextRenderer richText={text} globals={globals} />
    </div>
  ) : null;

  // Button component
  const buttonElement = button ? (
    <div className={twMerge("w-fit", centeredButton && "mx-auto")}>
      <ButtonLink {...button} />
    </div>
  ) : null;

  // Render with or without animations
  if (useAnimations) {
    return (
      <div className={twMerge("flex flex-col gap-6", className)}>
        {headingElement && (
          <AnimatedWrapper delay={0} direction="up">
            {headingElement}
          </AnimatedWrapper>
        )}

        {textElement && (
          <AnimatedWrapper delay={0.1} direction="up">
            {textElement}
          </AnimatedWrapper>
        )}

        {buttonElement && (
          <AnimatedWrapper delay={0.2} direction="up">
            {buttonElement}
          </AnimatedWrapper>
        )}
      </div>
    );
  }

  return (
    <div className={twMerge("flex flex-col gap-6", className)}>
      {headingElement}
      {textElement}
      {buttonElement && <div className="pt-2">{buttonElement}</div>}
    </div>
  );
};

export default SectionContent;

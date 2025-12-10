"use server";

import Image from "next/image";
import { twMerge } from "tailwind-merge";
import type { Media } from "@/payload-types";

export type SectionHeadingProps = {
  heading?: {
    icon?:
      | {
          url?: string | null;
          alt?: string | null;
        }
      | string
      | number
      | null;
    text?: string | null;
    centered?: boolean | null;
  } | null;
  tagName?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  iconSize?: "small" | "medium" | "large";
};

const SectionHeading: React.FC<SectionHeadingProps> = ({
  heading,
  tagName = "h5",
  iconSize = "small",
}) => {
  // Heading icon media
  const headingIconMedia =
    heading?.icon &&
    typeof heading.icon === "object" &&
    heading.icon !== null &&
    "url" in heading.icon
      ? (heading.icon as Media)
      : null;

  if (!heading || !(headingIconMedia || heading.text)) {
    return null;
  }

  // Default heading classes
  const getHeadingClasses = () => {
    switch (tagName) {
      case "h1":
        return twMerge(
          "text-[32px] font-bold",
          "bg-linear-to-r from-primary-purple to-primary-lightpurple",
          "bg-clip-text text-transparent",
          "md:text-[40px]",
          "lg:text-[48px]",
        );
      case "h2":
        return twMerge(
          "text-[24px] font-bold",
          "bg-linear-to-r from-primary-purple to-primary-lightpurple",
          "bg-clip-text text-transparent",
          "md:text-[30px]",
          "lg:text-[36px]",
        );
      case "h3":
        return twMerge(
          "text-[20px] font-bold",
          "bg-linear-to-r from-primary-purple to-primary-lightpurple",
          "bg-clip-text text-transparent",
          "md:text-[24px]",
          "lg:text-[28px]",
        );
      case "h4":
        return twMerge(
          "text-[18px] font-semibold text-primary-purple",
          "md:text-[20px]",
          "lg:text-[22px]",
        );
      case "h5":
        return "font-semibold text-primary-purple";
      case "h6":
        return twMerge(
          "text-[14px] font-semibold text-primary-purple",
          "md:text-[15px]",
        );
      default:
        return "font-semibold text-primary-purple";
    }
  };

  const defaultHeadingClasses = getHeadingClasses();

  // Icon size classes
  const getIconSizeClasses = () => {
    switch (iconSize) {
      case "small":
        return "relative block h-5 w-5 shrink-0";
      case "medium":
        return twMerge(
          "relative block h-6 w-6 shrink-0",
          "transition-transform duration-300 hover:scale-110",
        );
      case "large":
        return twMerge(
          "relative block h-8 w-8 shrink-0",
          "transition-transform duration-300 hover:scale-110",
        );
      default:
        return "relative block h-5 w-5 shrink-0";
    }
  };

  const iconSizeClasses = getIconSizeClasses();

  return (
    <div
      className={twMerge(
        "flex items-center gap-3",
        heading.centered && "justify-center",
      )}
    >
      {headingIconMedia && (
        <span className={iconSizeClasses}>
          <Image
            className="object-contain"
            src={`${process.env.NEXT_PUBLIC_SERVER_URL}${headingIconMedia.url}`}
            alt={headingIconMedia.alt || ""}
            fill={true}
            sizes={
              iconSize === "small"
                ? "20px"
                : iconSize === "medium"
                  ? "24px"
                  : "32px"
            }
          />
        </span>
      )}

      {heading.text && (
        <>
          {tagName === "h1" ? (
            <h1 className={twMerge(defaultHeadingClasses)}>{heading.text}</h1>
          ) : tagName === "h2" ? (
            <h2 className={twMerge(defaultHeadingClasses)}>{heading.text}</h2>
          ) : tagName === "h3" ? (
            <h3 className={twMerge(defaultHeadingClasses)}>{heading.text}</h3>
          ) : tagName === "h4" ? (
            <h4 className={twMerge(defaultHeadingClasses)}>{heading.text}</h4>
          ) : tagName === "h5" ? (
            <h5 className={twMerge(defaultHeadingClasses)}>{heading.text}</h5>
          ) : (
            <h6 className={twMerge(defaultHeadingClasses)}>{heading.text}</h6>
          )}
        </>
      )}
    </div>
  );
};

export default SectionHeading;

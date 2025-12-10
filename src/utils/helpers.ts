export const getMediaUrlAndAlt = (
  media:
    | {
        url?: string | null;
        alt?: string | null;
      }
    | string
    | number
    | null
    | undefined,
) => {
  if (!media || typeof media === "string" || typeof media === "number") {
    return { url: "", alt: "" };
  }

  // Get the URL of the media
  const url = media.url
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}${media.url}`
    : "";

  // Get the alt text of the media
  const alt = media.alt || "";

  // Return the URL and alt text
  return { url, alt };
};

export const getPaddingClasses = (
  paddingTop?: "none" | "small" | "medium" | "large" | null,
  paddingBottom?: "none" | "small" | "medium" | "large" | null,
): string => {
  const topClass =
    paddingTop === "none"
      ? "pt-0"
      : paddingTop === "small"
        ? "pt-6"
        : paddingTop === "medium"
          ? "pt-12"
          : paddingTop === "large"
            ? "pt-16"
            : "pt-12";
  const bottomClass =
    paddingBottom === "none"
      ? "pb-0"
      : paddingBottom === "small"
        ? "pb-6"
        : paddingBottom === "medium"
          ? "pb-12"
          : paddingBottom === "large"
            ? "pb-16"
            : "pb-12";

  return `${topClass} ${bottomClass}`;
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

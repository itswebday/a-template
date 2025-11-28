import { DEFAULT_LOCALE } from "@/constants";
import type { FieldHook } from "payload";

export const generateBlogPostUrl: FieldHook = ({ data, req }) => {
  const slug = data?.slug;
  const locale = req?.locale || DEFAULT_LOCALE;

  if (slug) {
    const slugValue = Array.isArray(slug) ? slug[0] : slug;

    if (slugValue && typeof slugValue === "string") {
      const basePath = `/blog/${slugValue}`;

      return locale === DEFAULT_LOCALE ? basePath : `/${locale}${basePath}`;
    }
  }
  return "";
};

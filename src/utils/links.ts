import { LINK_TYPE_OPTIONS } from "@/constants";
import type { LinkType } from "@/types";
import type { Field } from "payload";

export const getGlobalUrl = (global: unknown): string | null => {
  if (
    typeof global === "object" &&
    global !== null &&
    "url" in global &&
    global.url
  ) {
    if (global.url && typeof global.url === "string") {
      return global.url;
    }
  }
  return null;
};

export const getLinkHref = (
  link: {
    customHref?: boolean | null;
    href?: string | null;
    linkType?: LinkType | null;
    page?: {
      relationTo: "pages";
      value: number | { url?: string | null; slug?: string | null } | null;
    } | null;
    blogPost?: {
      relationTo: "blog-posts";
      value: number | { url?: string | null; slug?: string | null } | null;
    } | null;
  },
  globals: {
    home: unknown;
    blog: unknown;
    privacyPolicy: unknown;
    cookiePolicy: unknown;
    termsAndConditions: unknown;
  },
): string => {
  if (link.customHref) {
    return link.href || "";
  } else {
    if (link.linkType === "home") {
      return getGlobalUrl(globals.home) || "";
    }

    if (link.linkType === "blog") {
      return getGlobalUrl(globals.blog) || "";
    }

    if (link.linkType === "privacy-policy") {
      return getGlobalUrl(globals.privacyPolicy) || "";
    }

    if (link.linkType === "cookie-policy") {
      return getGlobalUrl(globals.cookiePolicy) || "";
    }

    if (link.linkType === "terms-and-conditions") {
      return getGlobalUrl(globals.termsAndConditions) || "";
    }

    const pageValue = link.page?.value || link.blogPost?.value;
    const pageUrl =
      typeof pageValue === "object" && pageValue !== null && "url" in pageValue
        ? pageValue.url || ""
        : "";

    return pageUrl;
  }
};

export const getButtonHref = (
  button:
    | {
        customHref?: boolean | null;
        href?: string | null;
        linkType?: LinkType | null;
        page?: {
          relationTo: "pages";
          value: number | { url?: string | null; slug?: string | null } | null;
        } | null;
        blogPost?: {
          relationTo: "blog-posts";
          value: number | { url?: string | null; slug?: string | null } | null;
        } | null;
      }
    | null
    | undefined,
  globals: {
    home: unknown;
    blog: unknown;
    privacyPolicy: unknown;
    cookiePolicy: unknown;
    termsAndConditions: unknown;
  },
): string | null => {
  if (!button) {
    return null;
  }

  const pageField = button.page;
  const blogPostField = button.blogPost;

  return getLinkHref(
    {
      customHref: button.customHref,
      href: button.href,
      linkType: button.linkType,
      page: pageField
        ? {
            relationTo: "pages" as const,
            value: pageField.value,
          }
        : null,
      blogPost: blogPostField
        ? {
            relationTo: "blog-posts" as const,
            value: blogPostField.value,
          }
        : null,
    },
    globals,
  );
};

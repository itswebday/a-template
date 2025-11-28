import { LINK_TYPE_OPTIONS } from "@/constants";
import type { Field } from "payload";

export const getGlobalUrl = (global: unknown): string | null => {
  if (
    typeof global === "object" &&
    global !== null &&
    "url" in global &&
    global.url
  ) {
    const urlValue = Array.isArray(global.url) ? global.url[0] : global.url;
    if (typeof urlValue === "string") {
      return urlValue;
    }
  }
  return null;
};

export const getLinkHref = (
  link: {
    customHref?: boolean | null;
    href?: string | null;
    linkType?:
      | "page"
      | "home"
      | "blog"
      | "blog-post"
      | "privacy-policy"
      | "cookie-policy"
      | "terms-and-conditions"
      | null;
    page?: {
      relationTo: "pages" | "blog-posts";
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
    const linkType = link.linkType || "page";

    if (linkType === "home") {
      return getGlobalUrl(globals.home) || "";
    }

    if (linkType === "blog") {
      return getGlobalUrl(globals.blog) || "";
    }

    if (linkType === "privacy-policy") {
      return getGlobalUrl(globals.privacyPolicy) || "";
    }

    if (linkType === "cookie-policy") {
      return getGlobalUrl(globals.cookiePolicy) || "";
    }

    if (linkType === "terms-and-conditions") {
      return getGlobalUrl(globals.termsAndConditions) || "";
    }

    const pageValue = link.page?.value;
    const pageUrl =
      typeof pageValue === "object" && pageValue !== null && "url" in pageValue
        ? pageValue.url || ""
        : "";

    return pageUrl;
  }
};

export const getLinkFields = ({
  includeDropdown = false,
  localizedText = true,
}: {
  includeDropdown?: boolean;
  localizedText?: boolean;
} = {}): Field[] => {
  const baseFields: Field[] = [
    {
      name: "text",
      label: "Text",
      type: "text",
      required: true,
      localized: localizedText,
    },
    {
      name: "customHref",
      label: "Custom URL",
      type: "checkbox",
      defaultValue: false,
      admin: {
        condition: includeDropdown
          ? (_, siblingData) => {
              return !siblingData?.dropdown || siblingData?.clickable;
            }
          : undefined,
      },
    },
    {
      name: "href",
      label: "URL",
      type: "text",
      required: true,
      localized: true,
      admin: {
        condition: (_, siblingData) => {
          if (includeDropdown) {
            return (
              siblingData?.customHref &&
              (!siblingData?.dropdown || siblingData?.clickable)
            );
          }
          return siblingData?.customHref;
        },
      },
    },
    {
      name: "linkType",
      label: "Link Type",
      type: "select",
      options: LINK_TYPE_OPTIONS,
      defaultValue: "page",
      required: true,
      admin: {
        condition: (_, siblingData) => {
          if (includeDropdown) {
            return (
              !siblingData?.customHref &&
              (!siblingData?.dropdown || siblingData?.clickable)
            );
          }
          return !siblingData?.customHref;
        },
      },
    },
    {
      name: "page",
      label: "Page",
      type: "relationship",
      relationTo: ["pages", "blog-posts"],
      validate: (
        value: unknown,
        { siblingData }: { siblingData?: Record<string, unknown> },
      ) => {
        const linkType = siblingData?.linkType as
          | "page"
          | "blog-post"
          | "home"
          | "blog"
          | "privacy-policy"
          | "cookie-policy"
          | "terms-and-conditions"
          | undefined;
        if (includeDropdown) {
          if (
            !siblingData?.customHref &&
            (!siblingData?.dropdown || siblingData?.clickable) &&
            (linkType === "page" || linkType === "blog-post") &&
            !value
          ) {
            return "Page is required when Link Type is Page or Blog Post";
          }
        } else {
          if (
            !siblingData?.customHref &&
            (linkType === "page" || linkType === "blog-post") &&
            !value
          ) {
            return "Page is required when Link Type is Page or Blog Post";
          }
        }
        return true;
      },
      admin: {
        condition: (_, siblingData) => {
          if (includeDropdown) {
            return (
              !siblingData?.customHref &&
              (!siblingData?.dropdown || siblingData?.clickable) &&
              (siblingData?.linkType === "page" ||
                siblingData?.linkType === "blog-post")
            );
          }
          return (
            !siblingData?.customHref &&
            (siblingData?.linkType === "page" ||
              siblingData?.linkType === "blog-post")
          );
        },
      },
    },
    {
      name: "newTab",
      label: "Open in a new tab",
      type: "checkbox",
      defaultValue: false,
    },
  ];

  if (includeDropdown) {
    baseFields.push(
      {
        name: "dropdown",
        label: "Dropdown link",
        type: "checkbox",
        defaultValue: false,
      },
      {
        name: "clickable",
        label: "Clickable",
        type: "checkbox",
        defaultValue: true,
        admin: {
          condition: (_, siblingData) => {
            return siblingData?.dropdown === true;
          },
        },
      },
    );
  }

  return baseFields;
};

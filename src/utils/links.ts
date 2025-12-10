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

export const getLinkFields = ({
  includeDropdown = false,
  localizedText = true,
  excludeTextField = false,
}: {
  includeDropdown?: boolean;
  localizedText?: boolean;
  excludeTextField?: boolean;
} = {}): Field[] => {
  const baseFields: Field[] = [];

  if (!excludeTextField) {
    baseFields.push({
      name: "text",
      label: "Text",
      type: "text",
      required: true,
      localized: localizedText,
    });
  }

  baseFields.push(
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
      label: "Link type",
      type: "select",
      options: LINK_TYPE_OPTIONS,
      defaultValue: "home",
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
      relationTo: ["pages"],
      admin: {
        condition: (_, siblingData) => {
          if (includeDropdown) {
            return (
              !siblingData?.customHref &&
              (!siblingData?.dropdown || siblingData?.clickable) &&
              siblingData?.linkType === "page"
            );
          }
          return !siblingData?.customHref && siblingData?.linkType === "page";
        },
      },
      validate: (
        value: unknown,
        { siblingData }: { siblingData?: Record<string, unknown> },
      ) => {
        if (includeDropdown) {
          if (
            !siblingData?.customHref &&
            (!siblingData?.dropdown || siblingData?.clickable) &&
            siblingData?.linkType === "page" &&
            !value
          ) {
            return "Page is required when Link Type is Page";
          }
        } else {
          if (
            !siblingData?.customHref &&
            siblingData?.linkType === "page" &&
            !value
          ) {
            return "Page is required when link type is Page";
          }
        }
        return true;
      },
    },
    {
      name: "blogPost",
      label: "Blog post",
      type: "relationship",
      relationTo: ["blog-posts"],
      admin: {
        condition: (_, siblingData) => {
          if (includeDropdown) {
            return (
              !siblingData?.customHref &&
              (!siblingData?.dropdown || siblingData?.clickable) &&
              siblingData?.linkType === "blog-post"
            );
          }
          return (
            !siblingData?.customHref && siblingData?.linkType === "blog-post"
          );
        },
      },
      validate: (
        value: unknown,
        { siblingData }: { siblingData?: Record<string, unknown> },
      ) => {
        if (includeDropdown) {
          if (
            !siblingData?.customHref &&
            (!siblingData?.dropdown || siblingData?.clickable) &&
            siblingData?.linkType === "blog-post" &&
            !value
          ) {
            return "Blog post is required when link type is Blog post";
          }
        } else {
          if (
            !siblingData?.customHref &&
            siblingData?.linkType === "blog-post" &&
            !value
          ) {
            return "Blog post is required when link type is Blog post";
          }
        }
        return true;
      },
    },
    {
      name: "newTab",
      label: "Open in a new tab",
      type: "checkbox",
      defaultValue: false,
    },
  );

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

export const getButtonLinkFields = ({
  includeDropdown = false,
  localizedText = true,
  optional = false,
}: {
  includeDropdown?: boolean;
  localizedText?: boolean;
  optional?: boolean;
} = {}): Field[] => {
  const fields: Field[] = [
    {
      name: "variant",
      label: "Variant",
      type: "select",
      options: [
        {
          label: "Purple button",
          value: "purpleButton",
        },
        {
          label: "White button",
          value: "whiteButton",
        },
        {
          label: "Dark button",
          value: "darkButton",
        },
        {
          label: "Transparent button",
          value: "transparentButton",
        },
      ],
      defaultValue: "purpleButton",
      required: true,
    },
    ...getLinkFields({ includeDropdown, localizedText }),
    {
      name: "centered",
      label: "Centered",
      type: "checkbox",
      defaultValue: false,
    },
  ];

  if (optional) {
    return [
      {
        name: "showButton",
        label: "Show button",
        type: "checkbox",
        defaultValue: false,
      },
      {
        name: "button",
        label: "Button",
        type: "group",
        admin: {
          condition: (_data, siblingData) => {
            return siblingData?.showButton === true;
          },
        },
        fields,
      },
    ];
  }

  return fields;
};

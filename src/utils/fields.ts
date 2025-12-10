import { LINK_TYPE_OPTIONS } from "@/constants";
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from "@payloadcms/plugin-seo/fields";
import type { Field } from "payload";

export const getBlockStyleFields = ({
  hiddenFields = [],
}: {
  hiddenFields?: string[];
} = {}): Field[] => {
  return [
    {
      name: "dark",
      label: "Dark background",
      type: "checkbox",
      defaultValue: false,
      admin: hiddenFields.includes("dark")
        ? ({
            hidden: true,
          } as { hidden: true })
        : undefined,
    },
  ];
};

export const getMetaFields = ({
  hiddenFields = [],
  relationTo = "media",
}: {
  hiddenFields?: string[];
  relationTo?: string;
} = {}): Field[] => {
  const overviewField = OverviewField({
    titlePath: "meta.title",
    descriptionPath: "meta.description",
    imagePath: "meta.image",
  });
  const titleField = MetaTitleField({});
  const descriptionField = MetaDescriptionField({});
  const imageField = MetaImageField({
    relationTo: relationTo,
  });
  const previewField = PreviewField({
    titlePath: "meta.title",
    descriptionPath: "meta.description",
  });

  return [
    {
      ...overviewField,
      admin: {
        ...(overviewField.admin || {}),
        ...(hiddenFields.includes("overview") ? { hidden: true } : {}),
      },
    } as Field,
    {
      ...titleField,
      admin: {
        ...(titleField.admin || {}),
        ...(hiddenFields.includes("title") ? { hidden: true } : {}),
      },
    } as Field,
    {
      ...descriptionField,
      admin: {
        ...(descriptionField.admin || {}),
        ...(hiddenFields.includes("description") ? { hidden: true } : {}),
      },
    } as Field,
    {
      ...imageField,
      admin: {
        ...(imageField.admin || {}),
        ...(hiddenFields.includes("image") ? { hidden: true } : {}),
      },
    } as Field,
    {
      ...previewField,
      admin: {
        ...(previewField.admin || {}),
        ...(hiddenFields.includes("preview") ? { hidden: true } : {}),
      },
    } as Field,
  ];
};

export const getPaddingFields = ({
  hiddenFields = [],
}: {
  hiddenFields?: string[];
} = {}): Field[] => {
  return [
    {
      name: "paddingTop",
      label: "Padding top",
      type: "select",
      options: [
        {
          label: "None",
          value: "none",
        },
        {
          label: "Small",
          value: "small",
        },
        {
          label: "Medium",
          value: "medium",
        },
        {
          label: "Large",
          value: "large",
        },
      ],
      defaultValue: "medium",
      admin: hiddenFields.includes("paddingTop") ? { hidden: true } : undefined,
    },
    {
      name: "paddingBottom",
      label: "Padding bottom",
      type: "select",
      options: [
        {
          label: "None",
          value: "none",
        },
        {
          label: "Small",
          value: "small",
        },
        {
          label: "Medium",
          value: "medium",
        },
        {
          label: "Large",
          value: "large",
        },
      ],
      defaultValue: "medium",
      admin: hiddenFields.includes("paddingBottom")
        ? { hidden: true }
        : undefined,
    },
  ];
};

export const getHeadingFields = ({
  hiddenFields = [],
  optional = false,
}: {
  hiddenFields?: string[];
  optional?: boolean;
} = {}): Field[] => {
  const fields: Field[] = [
    {
      name: "icon",
      label: "Small icon (optional)",
      type: "upload",
      relationTo: "media",
      admin: hiddenFields.includes("icon") ? { hidden: true } : undefined,
    },
    {
      name: "text",
      label: "Text",
      type: "text",
      defaultValue: "",
      localized: true,
      admin: hiddenFields.includes("text") ? { hidden: true } : undefined,
    },
    {
      name: "centered",
      label: "Centered",
      type: "checkbox",
      defaultValue: false,
      admin: hiddenFields.includes("centered") ? { hidden: true } : undefined,
    },
  ];

  if (optional) {
    return [
      {
        name: "showHeading",
        label: "Show heading",
        type: "checkbox",
        defaultValue: true,
        admin: hiddenFields.includes("showHeading")
          ? { hidden: true }
          : undefined,
      },
      {
        name: "heading",
        label: "Heading",
        type: "group",
        admin: {
          ...(hiddenFields.includes("heading")
            ? { hidden: true }
            : {
                condition: (_data, siblingData) => {
                  return siblingData?.showHeading === true;
                },
              }),
        },
        fields,
      },
    ];
  }

  return fields;
};

export const getLinkFields = ({
  hiddenFields = [],
  includeDropdown = false,
  localizedText = true,
  excludeTextField = false,
}: {
  hiddenFields?: string[];
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
      admin: hiddenFields.includes("text") ? { hidden: true } : undefined,
    });
  }

  baseFields.push({
    name: "customHref",
    label: "Custom URL",
    type: "checkbox",
    defaultValue: false,
    admin: {
      ...(hiddenFields.includes("customHref")
        ? { hidden: true }
        : {
            condition: includeDropdown
              ? (_, siblingData) => {
                  return !siblingData?.dropdown || siblingData?.clickable;
                }
              : undefined,
          }),
    },
  });

  baseFields.push({
    name: "href",
    label: "URL",
    type: "text",
    required: true,
    localized: true,
    admin: {
      ...(hiddenFields.includes("href")
        ? { hidden: true }
        : {
            condition: (_, siblingData) => {
              if (includeDropdown) {
                return (
                  siblingData?.customHref &&
                  (!siblingData?.dropdown || siblingData?.clickable)
                );
              }
              return siblingData?.customHref;
            },
          }),
    },
  });

  baseFields.push({
    name: "linkType",
    label: "Link type",
    type: "select",
    options: LINK_TYPE_OPTIONS,
    defaultValue: "home",
    required: true,
    admin: {
      ...(hiddenFields.includes("linkType")
        ? { hidden: true }
        : {
            condition: (_, siblingData) => {
              if (includeDropdown) {
                return (
                  !siblingData?.customHref &&
                  (!siblingData?.dropdown || siblingData?.clickable)
                );
              }
              return !siblingData?.customHref;
            },
          }),
    },
  });

  baseFields.push({
    name: "page",
    label: "Page",
    type: "relationship",
    relationTo: ["pages"],
    admin: {
      ...(hiddenFields.includes("page")
        ? { hidden: true }
        : {
            condition: (_, siblingData) => {
              if (includeDropdown) {
                return (
                  !siblingData?.customHref &&
                  (!siblingData?.dropdown || siblingData?.clickable) &&
                  siblingData?.linkType === "page"
                );
              }
              return (
                !siblingData?.customHref && siblingData?.linkType === "page"
              );
            },
          }),
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
  });

  baseFields.push({
    name: "blogPost",
    label: "Blog post",
    type: "relationship",
    relationTo: ["blog-posts"],
    admin: {
      ...(hiddenFields.includes("blogPost")
        ? { hidden: true }
        : {
            condition: (_, siblingData) => {
              if (includeDropdown) {
                return (
                  !siblingData?.customHref &&
                  (!siblingData?.dropdown || siblingData?.clickable) &&
                  siblingData?.linkType === "blog-post"
                );
              }
              return (
                !siblingData?.customHref &&
                siblingData?.linkType === "blog-post"
              );
            },
          }),
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
  });

  baseFields.push({
    name: "newTab",
    label: "Open in a new tab",
    type: "checkbox",
    defaultValue: false,
    admin: hiddenFields.includes("newTab") ? { hidden: true } : undefined,
  });

  if (includeDropdown) {
    baseFields.push({
      name: "dropdown",
      label: "Dropdown link",
      type: "checkbox",
      defaultValue: false,
      admin: hiddenFields.includes("dropdown") ? { hidden: true } : undefined,
    });

    baseFields.push({
      name: "clickable",
      label: "Clickable",
      type: "checkbox",
      defaultValue: true,
      admin: {
        ...(hiddenFields.includes("clickable")
          ? { hidden: true }
          : {
              condition: (_, siblingData) => {
                return siblingData?.dropdown === true;
              },
            }),
      },
    });
  }

  return baseFields;
};

export const getButtonLinkFields = ({
  hiddenFields = [],
  includeDropdown = false,
  localizedText = true,
  optional = false,
}: {
  hiddenFields?: string[];
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
      admin: hiddenFields.includes("variant") ? { hidden: true } : undefined,
    },
    ...getLinkFields({
      hiddenFields,
      includeDropdown,
      localizedText,
    }),
    {
      name: "centered",
      label: "Centered",
      type: "checkbox",
      defaultValue: false,
      admin: hiddenFields.includes("centered") ? { hidden: true } : undefined,
    },
  ];

  if (optional) {
    return [
      {
        name: "showButton",
        label: "Show button",
        type: "checkbox",
        defaultValue: false,
        admin: hiddenFields.includes("showButton")
          ? { hidden: true }
          : undefined,
      },
      {
        name: "button",
        label: "Button",
        type: "group",
        admin: {
          ...(hiddenFields.includes("button")
            ? { hidden: true }
            : {
                condition: (_data, siblingData) => {
                  return siblingData?.showButton === true;
                },
              }),
        },
        fields,
      },
    ];
  }

  return fields;
};

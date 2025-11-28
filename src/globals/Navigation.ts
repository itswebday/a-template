import type { GlobalConfig } from "payload";

export const Navigation: GlobalConfig = {
  slug: "navigation",
  label: "Navigation",
  admin: {
    group: "Content",
  },
  fields: [
    {
      name: "logo",
      label: "Logo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "links",
      labels: {
        singular: "Link",
        plural: "Links",
      },
      type: "array",
      defaultValue: [],
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: "text",
          label: "Text",
          type: "text",
          required: true,
          localized: true,
        },
        {
          name: "customHref",
          label: "Custom URL",
          type: "checkbox",
          defaultValue: false,
          admin: {
            condition: (_, siblingData) => {
              return !siblingData?.dropdown || siblingData?.clickable;
            },
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
              return (
                siblingData?.customHref &&
                (!siblingData?.dropdown || siblingData?.clickable)
              );
            },
          },
        },
        {
          name: "page",
          label: "Page",
          type: "relationship",
          relationTo: ["pages", "blog-posts"],
          required: true,
          admin: {
            condition: (_, siblingData) => {
              return (
                !siblingData?.customHref &&
                (!siblingData?.dropdown || siblingData?.clickable)
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
        {
          name: "sublinks",
          labels: {
            singular: "Sublink",
            plural: "Sublinks",
          },
          type: "array",
          defaultValue: [],
          admin: {
            initCollapsed: true,
            condition: (_, siblingData) => {
              return siblingData?.dropdown === true;
            },
          },
          fields: [
            {
              name: "text",
              label: "Text",
              type: "text",
              required: true,
              localized: true,
            },
            {
              name: "customHref",
              label: "Custom URL",
              type: "checkbox",
              defaultValue: false,
            },
            {
              name: "href",
              label: "URL",
              type: "text",
              required: true,
              localized: true,
              admin: {
                condition: (_, siblingData) => siblingData?.customHref,
              },
            },
            {
              name: "page",
              label: "Page",
              type: "relationship",
              relationTo: ["pages", "blog-posts"],
              required: true,
              admin: {
                condition: (_, siblingData) => !siblingData?.customHref,
              },
            },
            {
              name: "newTab",
              label: "Open in a new tab",
              type: "checkbox",
              defaultValue: false,
            },
          ],
        },
      ],
    },
    {
      name: "slideOutMenu",
      label: "Slide out menu",
      type: "checkbox",
      defaultValue: false,
    },
  ],
};

import type { GlobalConfig } from "payload";

export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Footer",
  admin: {
    group: "Content",
  },
  fields: [
    {
      name: "email",
      label: "Email",
      type: "group",
      fields: [
        {
          name: "text",
          label: "",
          type: "text",
          defaultValue: "",
        },
      ],
    },
    {
      name: "phone",
      label: "Phone",
      type: "group",
      fields: [
        {
          name: "text",
          label: "",
          type: "text",
          defaultValue: "",
        },
      ],
    },
    {
      name: "address",
      label: "Address",
      type: "group",
      fields: [
        {
          name: "text",
          label: "Text",
          type: "text",
          defaultValue: "",
        },
        {
          name: "href",
          label: "URL",
          type: "text",
          defaultValue: "",
        },
      ],
    },
    {
      name: "footerLinks",
      label: "Links",
      type: "array",
      defaultValue: [],
      fields: [
        {
          name: "text",
          label: "Text",
          type: "text",
          defaultValue: "",
          localized: true,
        },
        {
          name: "href",
          label: "URL",
          type: "text",
          defaultValue: "",
          localized: true,
        },
        {
          name: "newTab",
          label: "Open in a new tab",
          type: "checkbox",
          defaultValue: false,
        },
      ],
    },
    {
      name: "companyDetails",
      label: "Company details",
      type: "group",
      fields: [
        {
          name: "kvk",
          label: "KVK number",
          type: "text",
          defaultValue: "",
        },
        {
          name: "vat",
          label: "VAT number",
          type: "text",
          defaultValue: "",
        },
      ],
    },
  ],
};

import { getLinkFields } from "@/utils";
import type { GlobalConfig } from "payload";

export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Footer",
  admin: {
    group: "General",
  },
  fields: [
    {
      name: "logo",
      label: "Logo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "Paragraph",
      label: "Paragraph",
      type: "text",
      defaultValue: "",
      localized: true,
    },
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
      name: "quickLinks",
      labels: {
        singular: "Quick link",
        plural: "Quick links",
      },
      type: "array",
      defaultValue: [],
      admin: {
        initCollapsed: true,
      },
      fields: getLinkFields(),
    },
    {
      name: "services",
      labels: {
        singular: "Service",
        plural: "Services",
      },
      type: "array",
      defaultValue: [],
      admin: {
        initCollapsed: true,
      },
      fields: getLinkFields(),
    },
    {
      name: "socialMediaLinks",
      label: "Social media links",
      type: "array",
      maxRows: 5,
      labels: {
        singular: "Social media link",
        plural: "Social media links",
      },
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: "icon",
          label: "Icon (SVG file)",
          type: "upload",
          relationTo: "media",
        },
        {
          name: "href",
          label: "Link (URL)",
          type: "text",
          defaultValue: "",
        },
      ],
    },
    {
      name: "legalLinks",
      labels: {
        singular: "Legal link",
        plural: "Legal links",
      },
      type: "array",
      defaultValue: [],
      admin: {
        initCollapsed: true,
      },
      fields: getLinkFields(),
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

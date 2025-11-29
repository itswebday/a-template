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
      name: "links",
      labels: {
        singular: "Link",
        plural: "Links",
      },
      type: "array",
      defaultValue: [],
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

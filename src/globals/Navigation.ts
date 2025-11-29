import { getLinkFields } from "@/utils";
import type { GlobalConfig } from "payload";

export const Navigation: GlobalConfig = {
  slug: "navigation",
  label: "Navigation",
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
        ...getLinkFields({ includeDropdown: true }),
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
          fields: getLinkFields(),
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

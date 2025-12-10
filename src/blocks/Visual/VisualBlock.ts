import { getButtonLinkFields, getDarkField, getPaddingFields } from "@/utils";
import type { Block } from "payload";

export const VisualBlock: Block = {
  slug: "visual-block",
  labels: {
    singular: "Visual",
    plural: "Visual blocks",
  },
  interfaceName: "VisualBlock",
  fields: [
    {
      name: "visual",
      label: "Image or video",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "showSocialMediaLinks",
      label: "Show social media links",
      type: "checkbox",
      defaultValue: false,
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
        condition: (_, siblingData) => {
          return siblingData?.showSocialMediaLinks === true;
        },
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
    ...getButtonLinkFields({ optional: true }),
    getDarkField(),
    ...getPaddingFields(),
  ],
};

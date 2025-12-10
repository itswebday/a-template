import { RichTextField } from "@/fields";
import {
  getButtonLinkFields,
  getDarkField,
  getHeadingFields,
  getPaddingFields,
} from "@/utils";
import type { Block } from "payload";

export const TextAndImageBlock: Block = {
  slug: "text-and-image-block",
  labels: {
    singular: "Text and image",
    plural: "Text and image blocks",
  },
  interfaceName: "TextAndImageBlock",
  fields: [
    ...getHeadingFields({ optional: true }),
    RichTextField({ name: "text", label: "Text" }),
    ...getButtonLinkFields({ optional: true }),
    {
      name: "image",
      label: "Image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "imageSide",
      label: "Image position",
      type: "select",
      options: [
        {
          label: "Left",
          value: "left",
        },
        {
          label: "Right",
          value: "right",
        },
      ],
      defaultValue: "right",
    },
    {
      name: "width",
      label: "Width",
      type: "select",
      options: [
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
    },
    getDarkField(),
    ...getPaddingFields(),
  ],
};

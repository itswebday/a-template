import { RichTextField } from "@/fields/RichTextField";
import {
  getBlockStyleFields,
  getButtonLinkFields,
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
    ...getHeadingFields({ optional: true, hiddenFields: ["centered"] }),
    RichTextField({ name: "text", label: "Text" }),
    ...getButtonLinkFields({ optional: true, hiddenFields: ["centered"] }),
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
    ...getBlockStyleFields(),
    ...getPaddingFields(),
  ],
};

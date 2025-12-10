import { RichTextField } from "@/fields";
import {
  getBlockStyleFields,
  getButtonLinkFields,
  getHeadingFields,
  getPaddingFields,
} from "@/utils";
import type { Block } from "payload";

export const TextBlock: Block = {
  slug: "text-block",
  labels: {
    singular: "Text",
    plural: "Text blocks",
  },
  interfaceName: "TextBlock",
  fields: [
    ...getHeadingFields({ optional: true }),
    RichTextField({ name: "text", label: "Text" }),
    ...getButtonLinkFields({ optional: true }),
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

import { RichTextField } from "@/fields/RichTextField";
import type { Block } from "payload";

export const TextAndImageBlock: Block = {
  slug: "textAndImage",
  labels: {
    singular: "Text and Image",
    plural: "Text and Image Blocks",
  },
  interfaceName: "TextAndImageBlock",
  fields: [
    RichTextField({ name: "text", label: "Text" }),
    {
      name: "image",
      label: "Image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "imageLeft",
      type: "checkbox",
      label: "Image on the left",
      defaultValue: false,
    },
  ],
};

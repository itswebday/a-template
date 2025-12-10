import { RichTextField } from "@/fields";
import {
  getBlockStyleFields,
  getButtonLinkFields,
  getPaddingFields,
} from "@/utils";
import type { Block } from "payload";

export const CardsBlock: Block = {
  slug: "cards-block",
  labels: {
    singular: "Cards",
    plural: "Cards blocks",
  },
  interfaceName: "CardsBlock",
  fields: [
    {
      name: "cards",
      label: "Cards",
      type: "array",
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: "icon",
          label: "Icon",
          type: "upload",
          relationTo: "media",
        },
        RichTextField({ name: "text", label: "Text" }),
        ...getButtonLinkFields({ optional: true }),
      ],
    },
    ...getBlockStyleFields(),
    ...getPaddingFields(),
  ],
};

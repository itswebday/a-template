import { getDarkField, getPaddingFields } from "@/utils";
import type { Block } from "payload";

export const ProcessBlock: Block = {
  slug: "process-block",
  labels: {
    singular: "Process",
    plural: "Process blocks",
  },
  interfaceName: "ProcessBlock",
  fields: [
    {
      name: "steps",
      label: "Steps",
      type: "array",
      minRows: 1,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: "number",
          label: "Number",
          type: "text",
          defaultValue: "",
        },
        {
          name: "title",
          label: "Title",
          type: "text",
          defaultValue: "",
          localized: true,
        },
        {
          name: "description",
          label: "Description",
          type: "text",
          defaultValue: "",
          localized: true,
        },
        {
          name: "image",
          label: "Image",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
    getDarkField(),
    ...getPaddingFields(),
  ],
};

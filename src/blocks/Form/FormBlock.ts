import {
  getBlockStyleFields,
  getButtonLinkFields,
  getHeadingFields,
  getPaddingFields,
} from "@/utils";
import type { Block } from "payload";

export const FormBlock: Block = {
  slug: "form-block",
  labels: {
    singular: "Form",
    plural: "Form blocks",
  },
  interfaceName: "FormBlock",
  fields: [
    {
      name: "form",
      label: "Form",
      type: "relationship",
      relationTo: "forms",
      required: true,
      admin: {
        description: "Select the form that should be shown",
      },
    },
    {
      name: "fullScreen",
      label: "Full screen",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "showHeading",
      label: "Show heading",
      type: "checkbox",
      defaultValue: true,
      admin: {
        condition: (_data, siblingData) => {
          return siblingData?.fullScreen === false;
        },
      },
    },
    {
      name: "heading",
      label: "Heading",
      type: "group",
      admin: {
        condition: (_data, siblingData) => {
          return (
            siblingData?.fullScreen === false &&
            siblingData?.showHeading === true
          );
        },
      },
      fields: getHeadingFields({ optional: false, hiddenFields: ["centered"] }),
    },
    {
      name: "text",
      label: "Text",
      type: "richText",
      admin: {
        condition: (_data, siblingData) => {
          return siblingData?.fullScreen === false;
        },
      },
    },
    {
      name: "showButton",
      label: "Show button",
      type: "checkbox",
      defaultValue: false,
      admin: {
        condition: (_data, siblingData) => {
          return siblingData?.fullScreen === false;
        },
      },
    },
    {
      name: "button",
      label: "Button",
      type: "group",
      admin: {
        condition: (_data, siblingData) => {
          return (
            siblingData?.fullScreen === false &&
            siblingData?.showButton === true
          );
        },
      },
      fields: getButtonLinkFields({
        optional: false,
        hiddenFields: ["centered"],
      }),
    },
    {
      name: "formSide",
      label: "Form position",
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
      defaultValue: "left",
      admin: {
        condition: (_data, siblingData) => {
          return siblingData?.fullScreen === false;
        },
      },
    },
    ...getBlockStyleFields(),
    ...getPaddingFields(),
  ],
};

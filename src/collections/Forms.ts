import { developer } from "@/access";
import { getLinkFields } from "@/utils";
import type { CollectionConfig } from "payload";

export const Forms: CollectionConfig = {
  slug: "forms",
  labels: {
    singular: "Formulier",
    plural: "Formulieren",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "updatedAt"],
    group: "Content",
  },
  access: {
    read: () => true,
    create: developer,
    update: developer,
    delete: developer,
  },
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
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
      name: "fields",
      label: "Fields",
      type: "array",
      labels: {
        singular: "Field",
        plural: "Fields",
      },
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: "name",
          label: "Name of the field",
          type: "text",
          defaultValue: "",
          localized: true,
        },
        {
          name: "type",
          label: "Field type",
          type: "select",
          options: [
            {
              label: "Select the type of the field",
              value: "",
            },
            {
              label: "Text",
              value: "text",
            },
            {
              label: "Textarea",
              value: "textarea",
            },
            {
              label: "Email",
              value: "email",
            },
            {
              label: "Phone",
              value: "tel",
            },
            {
              label: "Number",
              value: "number",
            },
            {
              label: "Select (dropdown)",
              value: "select",
            },
            {
              label: "Checkbox",
              value: "checkbox",
            },
            {
              label: "Radio",
              value: "radio",
            },
            {
              label: "Date",
              value: "date",
            },
            {
              label: "Time",
              value: "time",
            },
            {
              label: "Date and time",
              value: "datetime-local",
            },
            {
              label: "File",
              value: "file",
            },
            {
              label: "URL",
              value: "url",
            },
            {
              label: "Password",
              value: "password",
            },
            {
              label: "Hidden",
              value: "hidden",
            },
            {
              label: "Range",
              value: "range",
            },
            {
              label: "Color",
              value: "color",
            },
            {
              label: "Search",
              value: "search",
            },
          ],
          defaultValue: "",
        },
        {
          name: "options",
          label: "Select options",
          type: "array",
          labels: {
            singular: "Option",
            plural: "Options",
          },
          admin: {
            condition: (data, siblingData) => {
              const fieldType = siblingData?.type || data?.type;

              return fieldType === "select";
            },
            initCollapsed: true,
          },
          fields: [
            {
              name: "value",
              label: "",
              type: "text",
              defaultValue: "",
              localized: true,
            },
          ],
        },
        {
          name: "multiSelect",
          label: "Multiple options are selectable",
          type: "checkbox",
          defaultValue: false,
          admin: {
            condition: (data, siblingData) => {
              const fieldType = siblingData?.type || data?.type;
              return fieldType === "select";
            },
          },
        },
        {
          name: "maxNumFiles",
          label: "Maximum number of files",
          type: "number",
          admin: {
            condition: (data, siblingData) => {
              const fieldType = siblingData?.type || data?.type;
              return fieldType === "file";
            },
          },
          defaultValue: 5,
          min: 1,
          max: 10,
        },
        {
          name: "maxMBs",
          label: "Maximum total size (MB)",
          type: "number",
          admin: {
            condition: (data, siblingData) => {
              const fieldType = siblingData?.type || data?.type;
              return fieldType === "file";
            },
          },
          defaultValue: 25,
          min: 1,
          max: 100,
        },
        {
          name: "includeCheckboxLink",
          label: "Add checkbox link",
          type: "checkbox",
          defaultValue: false,
          admin: {
            condition: (data, siblingData) => {
              const fieldType = siblingData?.type || data?.type;
              return fieldType === "checkbox";
            },
          },
        },
        {
          name: "checkboxLink",
          label: "Link for checkbox",
          type: "group",
          admin: {
            condition: (data, siblingData) => {
              const fieldType = siblingData?.type || data?.type;
              return (
                fieldType === "checkbox" &&
                siblingData?.includeCheckboxLink === true
              );
            },
          },
          fields: [
            {
              name: "textWithLink",
              label: "Text with link",
              type: "text",
              defaultValue: "",
              localized: true,
            },
            ...getLinkFields({ excludeTextField: true }),
          ],
        },
        {
          name: "required",
          label: "Field is required",
          type: "checkbox",
          defaultValue: false,
        },
      ],
    },
  ],
};

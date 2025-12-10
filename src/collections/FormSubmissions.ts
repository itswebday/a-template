import { admin, developer } from "@/access";
import type { CollectionConfig } from "payload";

export const FormSubmissions: CollectionConfig = {
  slug: "form-submissions",
  labels: {
    singular: "Form submission",
    plural: "Form submissions",
  },
  admin: {
    useAsTitle: "form",
    defaultColumns: ["form", "submittedAt", "updatedAt"],
    group: "Content",
  },
  access: {
    read: admin,
    create: () => true, // Allow public submissions
    update: developer,
    delete: developer,
  },
  fields: [
    {
      name: "form",
      label: "Form",
      type: "relationship",
      relationTo: "forms",
      required: true,
    },
    {
      name: "submissionData",
      label: "Submission data",
      type: "json",
      required: true,
    },
    {
      name: "uploads",
      label: "Uploads",
      type: "array",
      fields: [
        {
          name: "field",
          label: "Field name",
          type: "text",
          required: true,
        },
        {
          name: "files",
          label: "Files",
          type: "relationship",
          relationTo: "media",
          hasMany: true,
          required: true,
        },
      ],
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: "submittedAt",
      label: "Submitted on",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
      hooks: {
        beforeValidate: [
          ({ value, operation }) => {
            if (operation === "create" && !value) {
              return new Date().toISOString();
            }
            return value;
          },
        ],
      },
    },
  ],
};

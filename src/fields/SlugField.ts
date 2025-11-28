import { Field } from "payload";

type SlugFieldProps = {
  name?: string;
  label?: string;
  generatedFrom?: string;
  description?: string;
  sidebar?: boolean;
  readOnly?: boolean;
};

export const SlugField = ({
  name = "slug",
  label = "Slug",
  generatedFrom = "title",
  description = `Automatically generated from the ${generatedFrom} field`,
  sidebar = true,
  readOnly = false,
}: SlugFieldProps = {}): Field => ({
  name: name,
  label: label,
  type: "text",
  defaultValue: "",
  localized: true,
  unique: true,
  admin: {
    description: description,
    position: sidebar ? "sidebar" : undefined,
    readOnly: readOnly,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        const source = data?.[generatedFrom] || "";

        if (!source || typeof source !== "string") {
          return "";
        }

        return source
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");
      },
    ],
  },
});

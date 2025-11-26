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
  description = `Automatisch gegenereerd op basis van de ${generatedFrom}`,
  sidebar = true,
  readOnly = true,
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
      ({ value, data }) => {
        if (value) {
          return value;
        }

        const source = data?.[generatedFrom] || "";

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

import type { Field } from "payload";

type TitleFieldProps = {
  name?: string;
  label?: string;
  required?: boolean;
};

export const TitleField = ({
  name = "title",
  label = "Title",
  required = true,
}: TitleFieldProps = {}): Field => ({
  name: name,
  label: label,
  type: "text",
  required: required,
  localized: true,
});

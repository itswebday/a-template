import { Field } from "payload";

type CreatedAtFieldProps = {
  name?: string;
  label?: string;
  sidebar?: boolean;
  readOnly?: boolean;
};

export const CreatedAtField = ({
  name = "createdAt",
  label = "Created at",
  sidebar = true,
  readOnly = true,
}: CreatedAtFieldProps = {}): Field => ({
  name: name,
  label: label,
  type: "date",
  defaultValue: new Date(),
  admin: {
    date: {
      pickerAppearance: "dayAndTime",
      displayFormat: "dd-MM-yyyy HH:mm",
    },
    position: sidebar ? "sidebar" : undefined,
    readOnly: readOnly,
  },
});

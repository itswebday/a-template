import { generateUrlWithoutLocale } from "@/hooks";
import type { Field } from "payload";

type URLWithoutLocaleFieldProps = {
  name?: string;
  label?: string;
  sidebar?: boolean;
};

export const URLWithoutLocaleField = ({
  name = "urlWithoutLocale",
  label = "URL without locale",
  sidebar = true,
}: URLWithoutLocaleFieldProps = {}): Field => ({
  name: name,
  label: label,
  type: "text",
  localized: true,
  admin: {
    readOnly: true,
    position: sidebar ? "sidebar" : undefined,
    description: "Automatically generated from URL field without locale prefix",
  },
  hooks: {
    beforeChange: [generateUrlWithoutLocale],
  },
});

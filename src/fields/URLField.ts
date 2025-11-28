import { DEFAULT_LOCALE } from "@/constants";
import type { Field } from "payload";

type URLFieldProps = {
  name?: string;
  label?: string;
  description?: string;
  sidebar?: boolean;
  generatedFrom?: string;
};

export const URLField = ({
  name = "url",
  label = "URL",
  description = "URL path for the page (e.g., /about or /nl/diensten/websites)",
  sidebar = true,
  generatedFrom = "title",
}: URLFieldProps): Field => ({
  name: name,
  label: label,
  type: "text",
  defaultValue: "",
  localized: true,
  unique: true,
  admin: {
    description: description,
    position: sidebar ? "sidebar" : undefined,
  },
  validate: (value: string | string[] | null | undefined) => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return true;
    }

    const urlValue = Array.isArray(value) ? value[0] : value;

    if (!urlValue || typeof urlValue !== "string") {
      return true;
    }

    if (urlValue === "/") {
      return "The root path / is reserved for the Homepage";
    }

    if (!urlValue.startsWith("/")) {
      return "URL must start with /";
    }

    if (urlValue.endsWith("/")) {
      return "URL must not end with /";
    }

    if (urlValue.includes("//") && !urlValue.startsWith("//")) {
      return "URL must not contain consecutive slashes";
    }

    if (!/^\/[a-zA-Z0-9\/\-_]*$/.test(urlValue)) {
      return "URL must not contain invalid characters";
    }

    return true;
  },
  hooks: {
    beforeValidate: [
      ({ value, data, req }) => {
        if (value && typeof value === "string" && value.trim() !== "") {
          let normalized = value.trim();

          if (!normalized.startsWith("/")) {
            normalized = `/${normalized}`;
          }

          if (normalized.endsWith("/")) {
            normalized = normalized.slice(0, -1);
          }

          normalized = normalized.replace(/(?<!^)\/+/g, "/");

          if (normalized === "/") {
            return "";
          }

          return normalized;
        }

        const source = data?.[generatedFrom] || "";

        if (!source || typeof source !== "string") {
          return "";
        }

        const slug = source
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");

        if (!slug) {
          return "";
        }

        const basePath = `/${slug}`;
        const locale = req?.locale || DEFAULT_LOCALE;

        return locale === DEFAULT_LOCALE ? basePath : `/${locale}${basePath}`;
      },
    ],
  },
});

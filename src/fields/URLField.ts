import { DEFAULT_LOCALE } from "@/constants";
import {
  generateBlogUrl,
  generateCookiePolicyUrl,
  generateHomeUrl,
  generatePrivacyPolicyUrl,
  generateTermsAndConditionsUrl,
} from "@/hooks";
import type { Field, FieldHook } from "payload";

type URLFieldProps = {
  name?: string;
  label?: string;
  description?: string;
  sidebar?: boolean;
  generatedFrom?: string;
  hook?:
    | "home"
    | "blog"
    | "privacyPolicy"
    | "cookiePolicy"
    | "termsAndConditions"
    | null;
};

export const URLField = ({
  name = "url",
  label = "URL",
  description = "URL path for the page (e.g., /about or /nl/diensten/websites)",
  sidebar = true,
  generatedFrom = "title",
  hook = null,
}: URLFieldProps): Field => {
  const hookMap = {
    home: generateHomeUrl,
    blog: generateBlogUrl,
    privacyPolicy: generatePrivacyPolicyUrl,
    cookiePolicy: generateCookiePolicyUrl,
    termsAndConditions: generateTermsAndConditionsUrl,
  } as const satisfies Record<
    "home" | "blog" | "privacyPolicy" | "cookiePolicy" | "termsAndConditions",
    FieldHook
  >;

  const hooks: {
    beforeValidate: FieldHook[];
    beforeChange?: FieldHook[];
  } = {
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
  };

  if (hook) {
    hooks.beforeChange = [hookMap[hook]];
  }

  return {
    name: name,
    label: label,
    type: "text",
    defaultValue: "",
    localized: true,
    unique: true,
    admin: {
      description: description,
      position: sidebar ? "sidebar" : undefined,
      readOnly: hook !== null,
    },
    validate: (value: string | string[] | null | undefined) => {
      if (!value || (typeof value === "string" && value.trim() === "")) {
        return true;
      }

      if (!value || typeof value !== "string") {
        return true;
      }

      if (value === "/") {
        return "The root path / is reserved for the Homepage";
      }

      if (!value.startsWith("/")) {
        return "URL must start with /";
      }

      if (value.endsWith("/")) {
        return "URL must not end with /";
      }

      if (value.includes("//") && !value.startsWith("//")) {
        return "URL must not contain consecutive slashes";
      }

      if (!/^\/[a-zA-Z0-9\/\-_]*$/.test(value)) {
        return "URL must not contain invalid characters";
      }

      return true;
    },
    hooks,
  };
};

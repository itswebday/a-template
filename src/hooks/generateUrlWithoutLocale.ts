import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import type { FieldHook } from "payload";

export const generateUrlWithoutLocale: FieldHook = ({ data, req }) => {
  if (!data?.url) {
    return "";
  }

  if (!data?.url || typeof data?.url !== "string") {
    return "";
  }

  if (req?.locale || DEFAULT_LOCALE === DEFAULT_LOCALE) {
    return data.url;
  }

  for (const loc of LOCALES) {
    if (loc !== DEFAULT_LOCALE && data.url.startsWith(`/${loc}/`)) {
      return data.url.slice(`/${loc}`.length);
    }

    if (loc !== DEFAULT_LOCALE && data.url === `/${loc}`) {
      return "/";
    }
  }

  return data.url;
};

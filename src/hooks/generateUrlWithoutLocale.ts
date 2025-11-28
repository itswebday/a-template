import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import type { FieldHook } from "payload";

export const generateUrlWithoutLocale: FieldHook = ({ data, req }) => {
  const url = data?.url;
  const locale = req?.locale || DEFAULT_LOCALE;

  if (!url) {
    return "";
  }

  const urlValue = Array.isArray(url) ? url[0] : url;

  if (!urlValue || typeof urlValue !== "string") {
    return "";
  }

  if (locale === DEFAULT_LOCALE) {
    return urlValue;
  }

  for (const loc of LOCALES) {
    if (loc !== DEFAULT_LOCALE && urlValue.startsWith(`/${loc}/`)) {
      return urlValue.slice(`/${loc}`.length);
    }

    if (loc !== DEFAULT_LOCALE && urlValue === `/${loc}`) {
      return "/";
    }
  }

  return urlValue;
};

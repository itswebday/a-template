import { DEFAULT_LOCALE } from "@/constants";
import type { FieldHook } from "payload";

// Helper to load messages for a locale
const getMessages = async (locale: string) => {
  try {
    const messages = await import(`../messages/${locale}.json`);
    return messages.default;
  } catch {
    // Fallback to default locale if locale messages don't exist
    const messages = await import(`../messages/${DEFAULT_LOCALE}.json`);
    return messages.default;
  }
};

// Helper to get href from messages for a given key
const getHrefFromMessages = async (
  locale: string,
  messageKey: string,
): Promise<string> => {
  const messages = await getMessages(locale);
  const keyParts = messageKey.split(".");
  let value: unknown = messages;

  for (const part of keyParts) {
    if (typeof value === "object" && value !== null && part in value) {
      value = (value as Record<string, unknown>)[part];
    } else {
      // Fallback to default locale if key not found
      const defaultMessages = await getMessages(DEFAULT_LOCALE);
      let defaultValue: unknown = defaultMessages;
      for (const defaultPart of keyParts) {
        if (
          typeof defaultValue === "object" &&
          defaultValue !== null &&
          defaultPart in defaultValue
        ) {
          defaultValue = (defaultValue as Record<string, unknown>)[defaultPart];
        } else {
          return "";
        }
      }
      return typeof defaultValue === "string" ? defaultValue : "";
    }
  }

  return typeof value === "string" ? value : "";
};

export const createGenerateGlobalUrlFromMessagesHook = (
  messageKey: string,
): FieldHook => {
  return async ({ req }) => {
    const locale = req?.locale || DEFAULT_LOCALE;
    const href = await getHrefFromMessages(locale, messageKey);

    return href || (locale === DEFAULT_LOCALE ? "/" : `/${locale}`);
  };
};

// Pre-configured hooks for each global
export const generateHomeUrl =
  createGenerateGlobalUrlFromMessagesHook("home.href");
export const generateBlogUrl =
  createGenerateGlobalUrlFromMessagesHook("blog.href");
export const generatePrivacyPolicyUrl =
  createGenerateGlobalUrlFromMessagesHook("privacyPolicy.href");
export const generateCookiePolicyUrl =
  createGenerateGlobalUrlFromMessagesHook("cookiePolicy.href");
export const generateTermsAndConditionsUrl =
  createGenerateGlobalUrlFromMessagesHook("termsAndConditions.href");

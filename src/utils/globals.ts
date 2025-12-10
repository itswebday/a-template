import type { Config } from "@/payload-types";
import type { LocaleOption } from "@/types";
import { unstable_cache } from "next/cache";
import { getCachedPayload } from "./payload";

type Global = keyof Config["globals"];

export const getGlobal = async <GlobalType extends Global>(
  slug: GlobalType,
  locale: LocaleOption,
  draft?: boolean,
) => {
  const payload = await getCachedPayload();
  const global = await payload.findGlobal({
    slug: slug,
    depth: 1,
    locale: locale,
    draft: draft,
    overrideAccess:
      draft ||
      [
        "home",
        "navigation",
        "footer",
        "blog",
        "privacy-policy",
        "cookie-policy",
        "terms-and-conditions",
      ].includes(slug)
        ? true
        : false,
  });

  return global;
};

export const getCachedGlobal = <GlobalType extends Global>(
  slug: GlobalType,
  locale: LocaleOption,
) => {
  return unstable_cache(() => getGlobal<GlobalType>(slug, locale), [slug], {
    tags: [`global_${slug}`],
  });
};

export const getGlobals = async (locale: LocaleOption) => {
  const [home, blog, privacyPolicy, cookiePolicy, termsAndConditions] =
    await Promise.all([
      getGlobal("home", locale),
      getGlobal("blog", locale),
      getGlobal("privacy-policy", locale),
      getGlobal("cookie-policy", locale),
      getGlobal("terms-and-conditions", locale),
    ]);

  return {
    home,
    blog,
    privacyPolicy,
    cookiePolicy,
    termsAndConditions,
  };
};

export const getCachedGlobals = (locale: LocaleOption) => {
  return unstable_cache(() => getGlobals(locale), [`globals_${locale}`], {
    tags: [
      `global_home`,
      `global_blog`,
      `global_privacy-policy`,
      `global_cookie-policy`,
      `global_terms-and-conditions`,
    ],
  });
};

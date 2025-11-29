import configPromise from "@/payload.config";
import type { Config } from "@/payload-types";
import type { LocaleOption } from "@/types";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";

type Global = keyof Config["globals"];

export const getGlobal = async <GlobalType extends Global>(
  slug: GlobalType,
  locale: LocaleOption,
  draft?: boolean,
) => {
  const payload = await getPayload({ config: configPromise });
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

export const getCachedGlobal = (slug: Global, locale: LocaleOption) => {
  return unstable_cache(() => getGlobal(slug, locale), [slug], {
    tags: [`global_${slug}`],
  });
};

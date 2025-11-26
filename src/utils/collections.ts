import type { LocaleOption } from "@/types";
import configPromise from "@/payload.config";
import type { Config } from "@/payload-types";
import { getPayload } from "payload";
import { unstable_cache } from "next/cache";

type Collection = keyof Config["collections"];
type FilterCondition = {
  field: string;
  operator:
    | "equals"
    | "not_equals"
    | "greater_than"
    | "less_than"
    | "in"
    | "not_in";
  value: unknown;
};
type Options = {
  filters?: FilterCondition[];
  sort?: {
    field: string;
    direction: "asc" | "desc";
  };
  exclude?: string[];
  depth?: number;
};

export const getCollection = async <CollectionType extends Collection>(
  collection: CollectionType,
  locale: LocaleOption,
  options?: Options,
): Promise<Config["collections"][CollectionType][]> => {
  const payload = await getPayload({ config: configPromise });
  const whereClause: Record<string, Record<string, unknown>> = {};

  if (options?.exclude?.length) {
    whereClause.slug = { not_in: options.exclude };
  }

  if (options?.filters?.length) {
    options.filters.forEach((filter) => {
      whereClause[filter.field] = { [filter.operator]: filter.value };
    });
  }

  const sortField = options?.sort?.field || "id";
  const sortDirection = options?.sort?.direction || "asc";

  const result = await payload.find({
    collection,
    locale,
    sort: `${sortDirection === "desc" ? "-" : ""}${sortField}`,
    depth: options?.depth,
    where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
    limit: 100,
  });

  return result.docs as Config["collections"][CollectionType][];
};

export const getDocument = async <CollectionType extends Collection>(
  collection: CollectionType,
  field: string,
  value: string,
  locale: LocaleOption,
  depth?: number,
): Promise<Config["collections"][CollectionType] | null> => {
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection,
    where: {
      [field]: {
        equals: value,
      },
    },
    locale,
    depth,
  });

  return result.docs.length > 0
    ? (result.docs[0] as Config["collections"][CollectionType])
    : null;
};

export const getCachedCollection = <CollectionType extends Collection>(
  collection: CollectionType,
  locale: LocaleOption,
  options?: Options,
) => {
  return unstable_cache(
    async () => getCollection(collection, locale, options),
    [`${collection}_${locale}_${JSON.stringify(options)}`],
    {
      tags: [`${collection}_${locale}`],
    },
  );
};

export const getCachedDocument = <CollectionType extends Collection>(
  collection: CollectionType,
  field: string,
  value: string,
  locale: LocaleOption,
  depth?: number,
) => {
  return unstable_cache(
    async () => getDocument(collection, field, value, locale, depth),
    [`${collection}_${field}_${value}_${locale}_${depth}`],
    {
      tags: [`${collection}_${field}_${value}_${locale}`],
    },
  );
};

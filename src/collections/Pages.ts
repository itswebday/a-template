import { authenticated, authenticatedOrPublished } from "@/access";
import {
  BlocksField,
  PublishedAtField,
  SlugField,
  TitleField,
  URLField,
  URLWithoutLocaleField,
} from "@/fields";
import { revalidatePage, revalidateDelete } from "@/hooks";
import { getMetaFields, getPreviewPathCollection } from "@/utils";
import type { CollectionConfig } from "payload";

export const Pages: CollectionConfig = {
  slug: "pages",
  labels: {
    singular: "Subpage",
    plural: "Subpages",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "url", "updatedAt"],
    group: "Pages",
    livePreview: {
      url: ({ data }) =>
        getPreviewPathCollection({
          url: data?.url,
          collection: "pages",
        }),
    },
    preview: (data) =>
      getPreviewPathCollection({
        url: data?.url as string,
        collection: "pages",
      }),
  },
  fields: [
    TitleField(),
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [BlocksField()],
        },
        {
          name: "meta",
          label: "SEO",
          fields: getMetaFields(),
        },
      ],
    },
    PublishedAtField({ isGlobal: false }),
    SlugField({ readOnly: true }),
    URLField({ label: "Page URL" }),
    URLWithoutLocaleField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: false,
    },
    maxPerDoc: 50,
  },
};

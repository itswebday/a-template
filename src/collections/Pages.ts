import { authenticated, authenticatedOrPublished } from "@/access";
import { blockConfigs } from "@/blocks/config";
import { URLField } from "@/fields";
import {
  generateUrlWithoutLocale,
  populatePublishedAtCollection,
} from "@/hooks";
import { revalidatePage, revalidateDelete } from "@/hooks/revalidate";
import { getPreviewPathCollection } from "@/utils";
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from "@payloadcms/plugin-seo/fields";
import type { CollectionConfig } from "payload";

export const Pages: CollectionConfig = {
  slug: "pages",
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
      url: ({ data, req }) =>
        getPreviewPathCollection({
          url: data?.url,
          collection: "pages",
          req,
        }),
    },
    preview: (data, { req }) =>
      getPreviewPathCollection({
        url: data?.url as string,
        collection: "pages",
        req,
      }),
  },
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            {
              name: "blocks",
              label: "Blocks",
              type: "blocks",
              blocks: blockConfigs,
              defaultValue: [],
            },
          ],
        },
        {
          name: "meta",
          label: "SEO",
          fields: [
            OverviewField({
              titlePath: "meta.title",
              descriptionPath: "meta.description",
              imagePath: "meta.image",
            }),
            MetaTitleField({}),
            MetaDescriptionField({}),
            MetaImageField({
              relationTo: "media",
            }),
            PreviewField({
              titlePath: "meta.title",
              descriptionPath: "meta.description",
            }),
          ],
        },
      ],
    },
    {
      name: "publishedAt",
      label: "Published at",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
          displayFormat: "dd-MM-yyyy HH:mm",
        },
        position: "sidebar",
      },
      hooks: {
        beforeChange: [populatePublishedAtCollection],
      },
    },
    URLField({ label: "Page URL" }),
    {
      name: "urlWithoutLocale",
      label: "URL without locale",
      type: "text",
      localized: true,
      admin: {
        readOnly: true,
        position: "sidebar",
        description:
          "Automatically generated from URL field without locale prefix",
      },
      hooks: {
        beforeChange: [generateUrlWithoutLocale],
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 50,
  },
};

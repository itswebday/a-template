import { authenticated, authenticatedOrPublished } from "@/access";
import { blockConfigs } from "@/blocks/config";
import { generateHomeUrl, populatePublishedAtGlobalField } from "@/hooks";
import { revalidateHomepage } from "@/hooks/revalidate";
import { getPreviewPathGlobal } from "@/utils/preview";
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from "@payloadcms/plugin-seo/fields";
import type { GlobalConfig } from "payload";

export const Home: GlobalConfig = {
  slug: "home",
  label: "Home page",
  access: {
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    group: "Pages",
    livePreview: {
      url: async ({ data }) =>
        await getPreviewPathGlobal({ global: "home", data }),
    },
    preview: async (data) =>
      await getPreviewPathGlobal({ global: "home", data }),
  },
  fields: [
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
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
          displayFormat: "dd-MM-yyyy HH:mm",
        },
        position: "sidebar",
      },
      hooks: {
        beforeChange: [populatePublishedAtGlobalField],
      },
    },
    {
      name: "url",
      label: "Page URL",
      type: "text",
      localized: true,
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "Automatically set",
      },
      hooks: {
        beforeChange: [generateHomeUrl],
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHomepage],
  },
  versions: {
    drafts: {
      autosave: false,
      schedulePublish: true,
    },
    max: 50,
  },
};

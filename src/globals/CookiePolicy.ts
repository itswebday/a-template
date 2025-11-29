import { authenticated, authenticatedOrPublished } from "@/access";
import { RichTextField } from "@/fields";
import {
  generateCookiePolicyUrl,
  populatePublishedAtGlobalField,
} from "@/hooks";
import { revalidateCookiePolicy } from "@/hooks/revalidate";
import { getPreviewPathGlobal } from "@/utils/preview";
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from "@payloadcms/plugin-seo/fields";
import type { GlobalConfig } from "payload";

export const CookiePolicy: GlobalConfig = {
  slug: "cookie-policy",
  label: "Cookie policy",
  access: {
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    group: "Legal pages",
    livePreview: {
      url: async ({ data }) =>
        await getPreviewPathGlobal({ global: "cookie-policy", data }),
    },
    preview: async (data) =>
      await getPreviewPathGlobal({ global: "cookie-policy", data }),
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [RichTextField({ name: "content", label: "Content" })],
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
        beforeChange: [generateCookiePolicyUrl],
      },
    },
  ],
  hooks: {
    afterChange: [revalidateCookiePolicy],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    max: 50,
  },
};

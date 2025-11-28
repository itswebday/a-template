import { authenticated, authenticatedOrPublished } from "@/access";
import { RichTextField } from "@/fields";
import {
  generatePrivacyPolicyUrl,
  populatePublishedAtGlobalField,
} from "@/hooks";
import { revalidatePrivacyPolicy } from "@/hooks/revalidate";
import { getPreviewPathGlobal } from "@/utils/preview";
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from "@payloadcms/plugin-seo/fields";
import type { GlobalConfig } from "payload";

export const PrivacyPolicy: GlobalConfig = {
  slug: "privacyPolicy",
  label: "Privacy Policy",
  access: {
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    group: "Legal",
    livePreview: {
      url: async ({ data }) =>
        await getPreviewPathGlobal({ global: "privacyPolicy", data }),
    },
    preview: async (data) =>
      await getPreviewPathGlobal({ global: "privacyPolicy", data }),
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            RichTextField({
              name: "content",
              label: "Content",
            }),
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
        beforeChange: [generatePrivacyPolicyUrl],
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePrivacyPolicy],
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

import { authenticated, authenticatedOrPublished } from "@/access";
import { PublishedAtField, URLField } from "@/fields";
import { RichTextField } from "@/fields/RichTextField";
import { revalidatePrivacyPolicy } from "@/hooks";
import { getMetaFields } from "@/utils";
import { getPreviewPathGlobal } from "@/utils/preview";
import type { GlobalConfig } from "payload";

export const PrivacyPolicy: GlobalConfig = {
  slug: "privacy-policy",
  label: "Privacy policy",
  access: {
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    group: "Legal pages",
    livePreview: {
      url: async ({ data }) =>
        await getPreviewPathGlobal({ global: "privacy-policy", data }),
    },
    preview: async (data) =>
      await getPreviewPathGlobal({ global: "privacy-policy", data }),
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
          fields: getMetaFields(),
        },
      ],
    },
    PublishedAtField({ isGlobal: true }),
    URLField({ label: "Page URL", hook: "privacyPolicy" }),
  ],
  hooks: {
    afterChange: [revalidatePrivacyPolicy],
  },
  versions: {
    drafts: {
      autosave: false,
      schedulePublish: true,
    },
    max: 50,
  },
};

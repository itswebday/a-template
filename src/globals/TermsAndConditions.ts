import { authenticated, authenticatedOrPublished } from "@/access";
import { PublishedAtField, RichTextField, URLField } from "@/fields";
import { revalidateTermsAndConditions } from "@/hooks";
import { getMetaFields } from "@/utils";
import { getPreviewPathGlobal } from "@/utils/preview";
import type { GlobalConfig } from "payload";

export const TermsAndConditions: GlobalConfig = {
  slug: "terms-and-conditions",
  label: "Terms and conditions",
  access: {
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    group: "Legal pages",
    livePreview: {
      url: async ({ data }) =>
        await getPreviewPathGlobal({ global: "terms-and-conditions", data }),
    },
    preview: async (data) =>
      await getPreviewPathGlobal({ global: "terms-and-conditions", data }),
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
    URLField({ label: "Page URL", hook: "termsAndConditions" }),
  ],
  hooks: {
    afterChange: [revalidateTermsAndConditions],
  },
  versions: {
    drafts: {
      autosave: false,
      schedulePublish: true,
    },
    max: 50,
  },
};

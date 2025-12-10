import { authenticated, authenticatedOrPublished } from "@/access";
import { PublishedAtField, RichTextField, URLField } from "@/fields";
import { revalidateCookiePolicy } from "@/hooks";
import { getMetaFields } from "@/utils";
import { getPreviewPathGlobal } from "@/utils/preview";
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
          fields: getMetaFields(),
        },
      ],
    },
    PublishedAtField({ isGlobal: true }),
    URLField({ label: "Page URL", hook: "cookiePolicy" }),
  ],
  hooks: {
    afterChange: [revalidateCookiePolicy],
  },
  versions: {
    drafts: {
      autosave: false,
      schedulePublish: true,
    },
    max: 50,
  },
};

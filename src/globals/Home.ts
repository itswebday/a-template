import { authenticated, authenticatedOrPublished } from "@/access";
import { BlocksField, PublishedAtField, URLField } from "@/fields";
import { revalidateHomepage } from "@/hooks";
import { getMetaFields } from "@/utils";
import { getPreviewPathGlobal } from "@/utils/preview";
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
          fields: [BlocksField()],
        },
        {
          name: "meta",
          label: "SEO",
          fields: getMetaFields(),
        },
      ],
    },
    PublishedAtField({ isGlobal: true }),
    URLField({ label: "Page URL", hook: "home" }),
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

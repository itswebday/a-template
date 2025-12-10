import { authenticated, authenticatedOrPublished } from "@/access";
import { PublishedAtField, URLField } from "@/fields";
import { revalidateBlog } from "@/hooks";
import { getMetaFields } from "@/utils";
import { getPreviewPathGlobal } from "@/utils/preview";
import type { GlobalConfig } from "payload";

export const Blog: GlobalConfig = {
  slug: "blog",
  label: "Blog overview page",
  access: {
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    group: "Pages",
    livePreview: {
      url: async ({ data }) =>
        await getPreviewPathGlobal({ global: "blog", data }),
    },
    preview: async (data) =>
      await getPreviewPathGlobal({ global: "blog", data }),
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            {
              name: "heading",
              label: "Heading",
              type: "text",
              localized: true,
            },
            {
              name: "paragraph",
              label: "Paragraph",
              type: "textarea",
              localized: true,
            },
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
    URLField({ label: "Page URL", hook: "blog" }),
  ],
  hooks: {
    afterChange: [revalidateBlog],
  },
  versions: {
    drafts: {
      autosave: false,
      schedulePublish: true,
    },
    max: 50,
  },
};

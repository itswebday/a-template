import { authenticated, authenticatedOrPublished } from "@/access";
import { generateBlogUrl, populatePublishedAtGlobalField } from "@/hooks";
import { revalidateBlog } from "@/hooks/revalidate";
import { getPreviewPathGlobal } from "@/utils/preview";
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from "@payloadcms/plugin-seo/fields";
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
        beforeChange: [generateBlogUrl],
      },
    },
  ],
  hooks: {
    afterChange: [revalidateBlog],
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

import { authenticatedOrPublished, developer } from "@/access";
import { RichTextField, SlugField } from "@/fields";
import { generateBlogPostUrl, populatePublishedAtCollection } from "@/hooks";
import {
  revalidateBlogPost,
  revalidateBlogPostDelete,
} from "@/hooks/revalidate";
import { getPreviewPathCollection } from "@/utils";
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from "@payloadcms/plugin-seo/fields";
import type { CollectionConfig } from "payload";

export const BlogPosts: CollectionConfig = {
  slug: "blog-posts",
  labels: {
    singular: "Blog post",
    plural: "Blog posts",
  },
  access: {
    create: developer,
    delete: developer,
    read: authenticatedOrPublished,
    update: developer,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "url", "updatedAt"],
    group: "Pages",
    livePreview: {
      url: ({ data }) =>
        getPreviewPathCollection({
          url: data?.url,
          collection: "blog-posts",
        }),
    },
    preview: (data) =>
      getPreviewPathCollection({
        url: data?.url as string,
        collection: "blog-posts",
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
      name: "minRead",
      label: "Reading time (minutes)",
      type: "number",
      defaultValue: 5,
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            {
              name: "image",
              label: "Image",
              type: "upload",
              relationTo: "media",
            },
            RichTextField({ name: "content", label: "Content" }),
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
    SlugField({ readOnly: true }),
    {
      name: "url",
      label: "URL",
      type: "text",
      localized: true,
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "Automatically generated from the slug field",
      },
      hooks: {
        beforeChange: [generateBlogPostUrl],
      },
    },
  ],
  hooks: {
    afterChange: [revalidateBlogPost],
    afterDelete: [revalidateBlogPostDelete],
  },
  versions: {
    drafts: {
      autosave: false,
    },
    maxPerDoc: 50,
  },
};

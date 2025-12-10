import { authenticatedOrPublished, developer } from "@/access";
import { PublishedAtField, SlugField, TitleField } from "@/fields";
import { RichTextField } from "@/fields/RichTextField";
import { generateBlogPostUrl } from "@/hooks";
import { revalidateBlogPost, revalidateBlogPostDelete } from "@/hooks";
import { getMetaFields, getPreviewPathCollection } from "@/utils";
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
    TitleField(),
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
          fields: getMetaFields(),
        },
      ],
    },
    PublishedAtField({ isGlobal: false }),
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

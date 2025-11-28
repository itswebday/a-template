import { authenticated, authenticatedOrPublished } from "@/access";
import { RichTextField, SlugField } from "@/fields";
import {
  revalidateBlogPost,
  revalidateBlogPostDelete,
} from "@/hooks/revalidateBlogPost";
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from "@payloadcms/plugin-seo/fields";
import type { CollectionConfig } from "payload";
import { getPreviewPathCollection } from "@/utils";
import { DEFAULT_LOCALE } from "@/constants";

export const BlogPosts: CollectionConfig = {
  slug: "blog-posts",
  labels: {
    singular: "Blog post",
    plural: "Blog posts",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "url", "updatedAt"],
    group: "Pages",
    livePreview: {
      url: ({ data, req }) =>
        getPreviewPathCollection({
          url: data?.url,
          collection: "blog-posts",
          req,
        }),
    },
    preview: (data, { req }) =>
      getPreviewPathCollection({
        url: data?.url as string,
        collection: "blog-posts",
        req,
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
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === "published" && !value) {
              return new Date();
            }
            return value;
          },
        ],
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
        beforeChange: [
          ({ data, req }) => {
            const slug = data?.slug;
            const locale = req?.locale || DEFAULT_LOCALE;

            if (slug) {
              const slugValue = Array.isArray(slug) ? slug[0] : slug;

              if (slugValue && typeof slugValue === "string") {
                const basePath = `/blog/${slugValue}`;

                return locale === DEFAULT_LOCALE
                  ? basePath
                  : `/${locale}${basePath}`;
              }
            }
            return "";
          },
        ],
      },
    },
  ],
  hooks: {
    afterChange: [revalidateBlogPost],
    afterDelete: [revalidateBlogPostDelete],
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 50,
  },
};

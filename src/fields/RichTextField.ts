import {
  AlignFeature,
  BlockquoteFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnderlineFeature,
  UnorderedListFeature,
} from "@payloadcms/richtext-lexical";
import { Field } from "payload";

type RichTextFieldProps = {
  name?: string;
  label?: string;
};

export const RichTextField = ({
  name = "text",
  label = "Text",
}: RichTextFieldProps = {}): Field => ({
  name: name,
  label: label,
  type: "richText",
  defaultValue: undefined,
  localized: true,
  editor: lexicalEditor({
    features: ({ rootFeatures }) => {
      return [
        ...rootFeatures.filter(
          (feature) =>
            !["upload", "relationship", "checklist"].includes(feature.key),
        ),
        HeadingFeature({
          enabledHeadingSizes: ["h1", "h2", "h3", "h4", "h5", "h6"],
        }),
        BoldFeature(),
        ItalicFeature(),
        UnderlineFeature(),
        StrikethroughFeature(),
        SubscriptFeature(),
        SuperscriptFeature(),
        InlineCodeFeature(),
        AlignFeature(),
        IndentFeature(),
        UnorderedListFeature(),
        OrderedListFeature(),
        LinkFeature({
          fields: () => {
            return [
              {
                name: "text",
                label: "Text",
                type: "text",
                required: true,
              },
              {
                name: "customHref",
                label: "Custom URL",
                type: "checkbox",
                defaultValue: false,
              },
              {
                name: "href",
                label: "URL",
                type: "text",
                required: true,
                admin: {
                  condition: (_, siblingData) => siblingData?.customHref,
                },
              },
              {
                name: "page",
                label: "Page",
                type: "relationship",
                relationTo: ["pages"],
                required: true,
                admin: {
                  condition: (_, siblingData) => !siblingData?.customHref,
                },
              },
              {
                name: "newTab",
                label: "Open in a new tab",
                type: "checkbox",
                defaultValue: false,
              },
            ];
          },
        }),
        BlockquoteFeature(),
        HorizontalRuleFeature(),
        FixedToolbarFeature(),
        InlineToolbarFeature(),
      ];
    },
  }),
});

import {
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  UnderlineFeature,
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
            !["upload", "textAlign", "relationship"].includes(feature.key),
        ),
        HeadingFeature({
          enabledHeadingSizes: ["h1", "h2", "h3", "h4", "h5", "h6"],
        }),
        BoldFeature(),
        ItalicFeature(),
        UnderlineFeature(),
        FixedToolbarFeature(),
        InlineToolbarFeature(),
      ];
    },
  }),
});

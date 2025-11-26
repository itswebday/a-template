type TextNode = {
  type: "text";
  text: string;
  mode?: string;
  style?: string;
  detail?: number;
  format?: number;
  version?: number;
};

type HeadingBlock = {
  type: "heading";
  tag: string;
  format?: string;
  indent?: number;
  version?: number;
  children: BlockNode[];
  direction?: "ltr" | "rtl";
};

type ParagraphBlock = {
  type: "paragraph";
  format?: string;
  indent?: number;
  version?: number;
  children: BlockNode[];
  direction?: "ltr" | "rtl";
  textStyle?: string;
  textFormat?: number;
};

type ListItemBlock = {
  type: "listitem";
  value?: number;
  format?: string;
  indent?: number;
  version?: number;
  children: BlockNode[];
  direction?: "ltr" | "rtl";
};

type ListBlock = {
  type: "list";
  format: "unordered" | "ordered";
  listType?: string;
  start?: number;
  children: ListItemBlock[];
  direction?: "ltr" | "rtl";
};

type QuoteBlock = {
  type: "quote";
  children: BlockNode[];
};

type CodeBlock = {
  type: "code";
  language?: string;
  children: BlockNode[];
};

type LinkNode = {
  type: "link";
  url?: string;
  fields?: {
    url: string;
    newTab?: boolean;
    linkType?: string;
  };
  children: BlockNode[];
};

type LineBreakNode = {
  type: "linebreak";
  version?: number;
};

type HorizontalRuleNode = {
  type: "horizontalrule";
  version?: number;
};

export type BlockNode =
  | TextNode
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | ListItemBlock
  | QuoteBlock
  | CodeBlock
  | LinkNode
  | LineBreakNode
  | HorizontalRuleNode;

export type RichText = {
  root: {
    children: BlockNode[];
  };
};

import { DEFAULT_LOCALE } from "@/constants";
import type { BlockNode, LocaleOption, RichText } from "@/types";
import { getLocale } from "next-intl/server";
import Link from "next/link";
import React from "react";

type RichTextRendererProps = {
  className?: string;
  richText: RichText;
};

const RichTextRenderer: React.FC<RichTextRendererProps> = async ({
  className,
  richText,
}) => {
  const locale = (await getLocale()) as LocaleOption;

  const renderBlockNode = (
    blockNode: BlockNode,
    index: number,
  ): React.ReactElement | null => {
    if (!Array.isArray(richText.root.children)) {
      return null;
    }

    switch (blockNode.type) {
      case "heading": {
        const tagName = blockNode.tag;
        const indent = blockNode.indent || 0;
        const format = blockNode.format || "";
        const classes: string[] = [];
        const style: React.CSSProperties = {};

        if (indent > 0) {
          style.paddingLeft = `${indent * 1.5}rem`;
        }

        if (format === "left" || format === "start") {
          classes.push("text-left");
        } else if (format === "center") {
          classes.push("text-center");
        } else if (format === "right" || format === "end") {
          classes.push("text-right");
        } else if (format === "justify") {
          classes.push("text-justify");
        }

        return React.createElement(
          tagName,
          {
            key: index,
            className: classes.join(" "),
            style: Object.keys(style).length > 0 ? style : undefined,
          },
          blockNode.children.map((child, i) => renderBlockNode(child, i)),
        );
      }

      case "paragraph": {
        const indent = blockNode.indent || 0;
        const format = blockNode.format || "";
        const classes: string[] = [];
        const style: React.CSSProperties = {};

        if (indent > 0) {
          style.paddingLeft = `${indent * 1.5}rem`;
        }

        if (format === "left" || format === "start") {
          classes.push("text-left");
        } else if (format === "center") {
          classes.push("text-center");
        } else if (format === "right" || format === "end") {
          classes.push("text-right");
        } else if (format === "justify") {
          classes.push("text-justify");
        }

        return (
          <p
            key={index}
            className={classes.join(" ")}
            style={Object.keys(style).length > 0 ? style : undefined}
          >
            {blockNode.children.map((child, i) => renderBlockNode(child, i))}
          </p>
        );
      }

      case "list": {
        const listType = blockNode.listType || blockNode.format;
        const isOrdered = listType === "number" || listType === "ordered";

        return isOrdered ? (
          <ol key={index} start={blockNode.start} className="list-decimal pl-6">
            {blockNode.children.map((child, i) => renderBlockNode(child, i))}
          </ol>
        ) : (
          <ul key={index} className="list-disc pl-6">
            {blockNode.children.map((child, i) => renderBlockNode(child, i))}
          </ul>
        );
      }

      case "listitem": {
        const indent = blockNode.indent || 0;
        const format = blockNode.format || "";
        const style: React.CSSProperties = {};
        const classes: string[] = [];

        if (indent > 0) {
          style.paddingLeft = `${indent * 1.5}rem`;
        }

        if (format === "left" || format === "start") {
          classes.push("text-left");
        } else if (format === "center") {
          classes.push("text-center");
        } else if (format === "right" || format === "end") {
          classes.push("text-right");
        } else if (format === "justify") {
          classes.push("text-justify");
        }

        return (
          <li
            key={index}
            className={classes.join(" ")}
            style={Object.keys(style).length > 0 ? style : undefined}
          >
            {blockNode.children.map((child, i) => renderBlockNode(child, i))}
          </li>
        );
      }

      case "quote":
        return (
          <blockquote
            key={index}
            className="border-l-4 border-gray-300 pl-4 italic my-4"
          >
            {blockNode.children.map((child, i) => renderBlockNode(child, i))}
          </blockquote>
        );

      case "link": {
        let href = "";

        if (blockNode.fields?.customUrl) {
          href =
            blockNode.fields.href ||
            `${locale === DEFAULT_LOCALE ? "/" : `/${locale}`}`;
        } else {
          href = `${locale === DEFAULT_LOCALE ? "" : `/${locale}`}${
            blockNode.fields?.page?.value.url
          }`;
        }

        return (
          <Link
            className="text-blue-600 hover:text-blue-800"
            key={index}
            href={href}
            target={blockNode.fields?.newTab ? "_blank" : "_self"}
            rel={blockNode.fields?.newTab ? "noopener noreferrer" : undefined}
          >
            {blockNode.children.map((child, i) => renderBlockNode(child, i))}
          </Link>
        );
      }

      case "linebreak":
        return <br key={index} />;

      case "horizontalrule":
        return <hr key={index} className="my-2 border-primary-lightgray" />;

      case "text": {
        const format = blockNode.format || 0;
        const classes: string[] = [];
        const style: React.CSSProperties = {};

        if ((format & 1) !== 0) {
          classes.push("font-bold");
        }

        if ((format & 2) !== 0) {
          classes.push("italic");
        }

        const hasStrikethrough = (format & 4) !== 0;
        const hasUnderline = (format & 8) !== 0;

        if (hasStrikethrough && hasUnderline) {
          style.textDecorationLine = "underline line-through";
        } else if (hasStrikethrough) {
          classes.push("line-through");
        } else if (hasUnderline) {
          classes.push("underline");
        }

        if ((format & 16) !== 0) {
          classes.push(
            "font-mono text-sm bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded-md border border-gray-200",
          );
        }
        if ((format & 32) !== 0) {
          classes.push("align-sub text-[70%] pl-0.5 pt-0.5");
        }

        if ((format & 64) !== 0) {
          classes.push("align-super text-[70%] pl-0.5");
        }

        return (
          <span
            key={index}
            className={classes.join(" ")}
            style={Object.keys(style).length > 0 ? style : undefined}
          >
            {blockNode.text}
          </span>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      className={`
        flex flex-col gap-2
        ${className}
      `}
    >
      {richText.root.children.map((child, index) =>
        renderBlockNode(child, index),
      )}
    </div>
  );
};

export default RichTextRenderer;

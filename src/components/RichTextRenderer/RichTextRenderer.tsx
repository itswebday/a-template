import type { BlockNode, RichText } from "@/types";
import Link from "next/link";
import React from "react";

type RichTextRendererProps = {
  className?: string;
  richText: RichText;
};

const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  className,
  richText,
}) => {
  const renderBlockNode = (
    blockNode: BlockNode,
    index: number,
    isInChecklist: boolean = false,
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
          blockNode.children.map((child, i) =>
            renderBlockNode(child, i, false),
          ),
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
            {blockNode.children.map((child, i) =>
              renderBlockNode(child, i, false),
            )}
          </p>
        );
      }

      case "list": {
        const listType = blockNode.listType || blockNode.format;
        const isChecklist = listType === "check";
        const isOrdered = listType === "number" || listType === "ordered";

        if (isChecklist) {
          return (
            <ul key={index} className="list-none space-y-2 my-2">
              {blockNode.children.map((child, i) =>
                renderBlockNode(child, i, true),
              )}
            </ul>
          );
        }

        return isOrdered ? (
          <ol
            key={index}
            start={blockNode.start}
            className="list-decimal pl-6 space-y-1 my-2"
          >
            {blockNode.children.map((child, i) =>
              renderBlockNode(child, i, false),
            )}
          </ol>
        ) : (
          <ul key={index} className="list-disc pl-6 space-y-1 my-2">
            {blockNode.children.map((child, i) =>
              renderBlockNode(child, i, false),
            )}
          </ul>
        );
      }

      case "listitem": {
        const indent = blockNode.indent || 0;
        const format = blockNode.format || "";
        const value = blockNode.value;
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

        const isChecklistItem = isInChecklist && (value === 0 || value === 1);
        const isChecked = value === 1;

        if (isChecklistItem) {
          return (
            <li
              key={index}
              className={`flex items-start gap-2 ${classes.join(" ")}`}
              style={Object.keys(style).length > 0 ? style : undefined}
            >
              <input
                type="checkbox"
                checked={isChecked}
                readOnly
                disabled
                className="mt-0.5 h-4 w-4 cursor-default shrink-0"
                aria-label={isChecked ? "Checked" : "Unchecked"}
              />
              <span className="flex-1">
                {blockNode.children.map((child, i) =>
                  renderBlockNode(child, i, false),
                )}
              </span>
            </li>
          );
        }

        return (
          <li
            key={index}
            className={classes.join(" ")}
            style={Object.keys(style).length > 0 ? style : undefined}
          >
            {blockNode.children.map((child, i) =>
              renderBlockNode(child, i, false),
            )}
          </li>
        );
      }

      case "quote":
        return (
          <blockquote
            key={index}
            className="border-l-4 border-gray-300 pl-4 italic my-4"
          >
            {blockNode.children.map((child, i) =>
              renderBlockNode(child, i, false),
            )}
          </blockquote>
        );

      case "link": {
        const url = blockNode.url || blockNode.fields?.url;
        const target = blockNode.fields?.newTab ? "_blank" : "_self";

        return (
          <Link
            className={`
              text-primary-green font-semibold hover:text-primary-darkgreen
              transition-colors duration-200
            `}
            key={index}
            href={url || "#"}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
          >
            {blockNode.children.map((child, i) =>
              renderBlockNode(child, i, false),
            )}
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

        if ((format & 1) !== 0) classes.push("font-bold");
        if ((format & 2) !== 0) classes.push("italic");
        if ((format & 4) !== 0) classes.push("line-through");
        if ((format & 8) !== 0) classes.push("underline");
        if ((format & 16) !== 0) {
          classes.push(
            "font-mono text-sm bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded-md border border-gray-200",
          );
        }
        if ((format & 32) !== 0)
          classes.push("align-sub text-[70%] pl-0.5 pt-0.5");
        if ((format & 64) !== 0) classes.push("align-super text-[70%] pl-0.5");

        return (
          <span key={index} className={classes.join(" ")}>
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
        flex flex-col gap-4
        ${className}
      `}
    >
      {richText.root.children.map((child, index) =>
        renderBlockNode(child, index, false),
      )}
    </div>
  );
};

export default RichTextRenderer;

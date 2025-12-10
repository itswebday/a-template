import { getLocale } from "next-intl/server";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";
import type { BlockNode, LocaleOption, RichText } from "@/types";
import { getLinkHref } from "@/utils";
import { getCachedGlobals, getGlobals } from "@/utils/server";

type RichTextRendererProps = {
  className?: string;
  richText: RichText;
  globals?: Awaited<ReturnType<typeof getGlobals>>;
};

const RichTextRenderer: React.FC<RichTextRendererProps> = async ({
  className,
  richText,
  globals: incomingGlobals,
}) => {
  const locale = (await getLocale()) as LocaleOption;
  const globals =
    incomingGlobals ??
    ((await getCachedGlobals(locale)()) as Awaited<
      ReturnType<typeof getGlobals>
    >);

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
            className: classes.join(" "),
            style: Object.keys(style).length > 0 ? style : undefined,
            key: index,
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
            className={classes.join(" ")}
            style={Object.keys(style).length > 0 ? style : undefined}
            key={index}
          >
            {blockNode.children.map((child, i) => renderBlockNode(child, i))}
          </p>
        );
      }

      case "list": {
        const listType = blockNode.listType || blockNode.format;
        const isOrdered = listType === "number" || listType === "ordered";

        return isOrdered ? (
          <ol className="list-decimal pl-6" key={index} start={blockNode.start}>
            {blockNode.children.map((child, i) => renderBlockNode(child, i))}
          </ol>
        ) : (
          <ul className="list-disc pl-6" key={index}>
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
            className={classes.join(" ")}
            style={Object.keys(style).length > 0 ? style : undefined}
            key={index}
          >
            {blockNode.children.map((child, i) => renderBlockNode(child, i))}
          </li>
        );
      }

      case "quote":
        return (
          <blockquote
            className={twMerge(
              "pl-4 my-4 italic border-l-4 border-primary-purple/30",
            )}
            key={index}
          >
            {blockNode.children.map((child, i) => renderBlockNode(child, i))}
          </blockquote>
        );

      case "link": {
        const pageField = blockNode.fields?.page;
        const blogPostField = (
          blockNode.fields as { blogPost?: { value: { url: string } } }
        )?.blogPost;
        const href = getLinkHref(
          {
            customHref: blockNode.fields?.customHref,
            href: blockNode.fields?.href,
            linkType: blockNode.fields?.linkType,
            page: pageField
              ? {
                  relationTo: "pages" as const,
                  value: pageField.value,
                }
              : null,
            blogPost: blogPostField
              ? {
                  relationTo: "blog-posts" as const,
                  value: blogPostField.value,
                }
              : null,
          },
          globals,
        );

        return (
          <Link
            key={index}
            className={twMerge(
              "text-primary-purple",
              "hover:text-primary-lightpurple",
            )}
            href={href}
            prefetch={false}
            rel={blockNode.fields?.newTab ? "noopener noreferrer" : undefined}
            target={blockNode.fields?.newTab ? "_blank" : "_self"}
          >
            {blockNode.children.map((child, i) => renderBlockNode(child, i))}
          </Link>
        );
      }

      case "linebreak":
        return <br key={index} />;

      case "horizontalrule":
        return <hr className="my-2 border-black/20" key={index} />;

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
            "font-mono text-[14px]",
            "px-1.5 py-0.5",
            "bg-primary-lightpurple/5",
            "text-dark",
            "rounded-md",
            "border border-primary-purple/20",
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
            className={classes.join(" ")}
            style={Object.keys(style).length > 0 ? style : undefined}
            key={index}
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
    <div className={twMerge("flex flex-col gap-2", className)}>
      {richText.root.children.map((child, index) =>
        renderBlockNode(child, index),
      )}
    </div>
  );
};

export default RichTextRenderer;

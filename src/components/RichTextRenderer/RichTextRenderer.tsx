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
  ): React.ReactElement | null => {
    if (!Array.isArray(richText.root.children)) {
      return null;
    }

    switch (blockNode.type) {
      case "heading": {
        const tagName = blockNode.tag;

        return React.createElement(
          tagName,
          { key: index },
          blockNode.children.map((child, i) => renderBlockNode(child, i)),
        );
      }

      case "paragraph":
        return (
          <p key={index}>
            {blockNode.children.map((child, i) => renderBlockNode(child, i))}
          </p>
        );

      case "list":
        return blockNode.listType === "bullet" ? (
          <ul key={index} className="list-disc pl-6">
            {blockNode.children.map((child, i) => renderBlockNode(child, i))}
          </ul>
        ) : (
          <ol key={index} start={blockNode.start} className="list-decimal pl-6">
            {blockNode.children.map((child, i) => renderBlockNode(child, i))}
          </ol>
        );

      case "listitem":
        return (
          <li key={index}>
            {blockNode.children.map((child, i) => renderBlockNode(child, i))}
          </li>
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
            {blockNode.children.map((child, i) => renderBlockNode(child, i))}
          </Link>
        );
      }

      case "linebreak":
        return <br key={index} />;

      case "horizontalrule":
        return <hr key={index} className="my-2 border-primary-lightgray" />;

      case "text":
        return (
          <span
            key={index}
            className={`
              ${blockNode.format === 1 ? "font-bold" : ""}
              ${blockNode.format === 2 ? "italic" : ""}
              ${blockNode.format === 3 ? "font-bold italic" : ""}
              ${blockNode.format === 4 ? "underline" : ""}
              ${blockNode.format === 5 ? "font-bold underline" : ""}
              ${blockNode.format === 6 ? "italic underline" : ""}
              ${blockNode.format === 7 ? "font-bold italic underline" : ""}
              ${blockNode.format === 8 ? "line-through" : ""}
              ${blockNode.format === 9 ? "font-bold line-through" : ""}
              ${blockNode.format === 10 ? "italic line-through" : ""}
              ${blockNode.format === 11 ? "font-bold italic line-through" : ""}
              ${blockNode.format === 32 ? "align-sub text-small" : ""}
              ${blockNode.format === 64 ? "align-super text-small" : ""}
            `}
          >
            {blockNode.text}
          </span>
        );

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
        renderBlockNode(child, index),
      )}
    </div>
  );
};

export default RichTextRenderer;

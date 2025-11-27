"use client";

import Link from "next/link";
import { useState } from "react";

export type FooterLinkProps = {
  className?: string;
  children: React.ReactNode;
  href?: string;
  target?: "_blank" | "_self";
  onClick?: () => void;
};

const FooterLink: React.FC<FooterLinkProps> = ({
  className,
  children,
  href,
  target = "_self",
  onClick,
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement, MouseEvent>,
  ) => {
    if (href && href.startsWith("#")) {
      e.preventDefault();

      const targetElement = document.querySelector(href);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "start",
        });
      }
    } else if (href) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 1000);
    }

    if (onClick) {
      onClick();
    }
  };

  const attributes = {
    className: `
      flex items-center py-0.5
      transition-opacity duration-200 hover:opacity-80
      ${isClicked && "pointer-events-none"}
      ${className}
    `,
  };

  return href ? (
    <Link
      {...attributes}
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      prefetch={true}
      onClick={handleClick}
    >
      {children}
    </Link>
  ) : (
    <div {...attributes}>{children}</div>
  );
};

export default FooterLink;

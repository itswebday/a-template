"use client";

import Link from "next/link";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export type FooterLinkProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  target?: "_blank" | "_self";
  onClick?: () => void;
};

const FooterLink: React.FC<FooterLinkProps> = ({
  children,
  className,
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

  return href ? (
    <Link
      className={twMerge(
        "flex items-center py-0.5",
        "transition-opacity duration-200 hover:opacity-80",
        isClicked && "pointer-events-none",
        className,
      )}
      href={href}
      prefetch={false}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      target={target}
      onClick={handleClick}
    >
      {children}
    </Link>
  ) : (
    <div
      className={twMerge(
        "flex items-center py-0.5",
        "transition-opacity duration-200 hover:opacity-80",
        isClicked && "pointer-events-none",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default FooterLink;

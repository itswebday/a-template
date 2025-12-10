"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { NavLink } from "@/components";
import { DropdownArrow } from "@/components/icons";

export type NavBarDropdownLinkProps = {
  className?: string;
  text: string;
  href?: string;
  newTab?: boolean;
  subLinks: { text: string; href: string; newTab: boolean }[];
  clickable?: boolean;
  onClick?: () => void;
};

const NavBarDropdownLink: React.FC<NavBarDropdownLinkProps> = ({
  className,
  text,
  href,
  newTab,
  subLinks,
  clickable = true,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (href && clickable) {
      if (href.startsWith("#")) {
        e.preventDefault();

        setTimeout(() => {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "start",
            });
          }
        }, 100);
      } else {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 1000);
      }
    }

    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={twMerge(
        "relative h-full",
        isClicked && "pointer-events-none",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Link */}
      <NavLink
        className="h-full"
        href={clickable ? href : undefined}
        target={newTab ? "_blank" : "_self"}
      >
        <div
          className={twMerge(
            "flex items-center gap-1 h-full",
            "transition-colors duration-200",
          )}
          onClick={handleClick}
        >
          {/* Text */}
          <span className="text-[15px] text-white">{text}</span>

          {/* Dropdown arrow */}
          <DropdownArrow
            className={twMerge(
              "w-4 h-4 text-white transition-transform duration-200",
              isHovered && "rotate-180",
            )}
          />
        </div>
      </NavLink>

      {isHovered && subLinks.length > 0 && (
        <div
          className={twMerge(
            "z-95 absolute -left-2 top-full flex flex-col w-52 pb-2 bg-dark",
          )}
        >
          {/* Sublinks */}
          {subLinks.map((subLink, index) => (
            <NavLink
              className="pl-5"
              key={index}
              href={subLink.href}
              target={subLink.newTab ? "_blank" : "_self"}
            >
              <span className="text-[14px] text-white">{subLink.text}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavBarDropdownLink;

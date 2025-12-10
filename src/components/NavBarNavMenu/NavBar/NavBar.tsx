"use client";

import { twMerge } from "tailwind-merge";
import { NavLink } from "@/components";
import NavBarDropdownLink from "./NavBarDropdownLink";

type NavBarProps = {
  className: string;
  links: {
    text: string;
    href: string;
    dropdown: boolean;
    clickable: boolean;
    newTab: boolean;
    subLinks: { text: string; href: string; newTab: boolean }[];
  }[];
};

const NavBar: React.FC<NavBarProps> = ({ className, links }) => {
  return (
    <div className={twMerge("flex items-center gap-8 h-full", className)}>
      {links.map((link, index) => {
        if ((link.subLinks || []).length === 0) {
          return (
            <NavLink
              key={index}
              href={link.href}
              target={link.newTab ? "_blank" : "_self"}
            >
              <span className="text-[15px] text-white">{link.text}</span>
            </NavLink>
          );
        }

        return (
          <NavBarDropdownLink
            key={index}
            text={link.text}
            href={link.clickable ? link.href : undefined}
            newTab={link.newTab}
            subLinks={link.subLinks.map((subLink) => ({
              text: subLink.text,
              href: subLink.href,
              newTab: subLink.newTab,
            }))}
            clickable={link.clickable}
          />
        );
      })}
    </div>
  );
};

export default NavBar;

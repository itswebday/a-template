"use client";

import { useNavMenu } from "@/contexts";
import Link from "next/link";

type NavMenuProps = {
  className?: string;
  links: {
    text: string;
    href: string;
    clickable: boolean;
    newTab: boolean;
    subLinks: { text: string; href: string; newTab: boolean }[];
  }[];
  slideOutMenu?: boolean;
};

const NavMenu: React.FC<NavMenuProps> = ({
  className,
  links,
  slideOutMenu = false,
}) => {
  const { isOpen, close } = useNavMenu();

  return (
    <div
      className={`
        z-90 fixed inset-0 flex flex-col bg-black/95
        ${
          slideOutMenu
            ? `
            transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"}
          `
            : `
            transition-opacity duration-300 ease-in-out
            ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
          `
        }
        ${className}
      `}
    >
      {/* Top bar */}
      <div className="w-full h-nav-bar bg-black" />

      {/* Container */}
      <div className="flex-1 w-5/6 py-12 mx-auto overflow-y-auto">
        {/* Links */}
        <div className="flex flex-col gap-2">
          {links.map((link, index) => (
            <div key={index} className="flex flex-col">
              {link.clickable ? (
                <Link
                  className={`
                    px-3 py-2 transition-opacity duration-200
                    hover:opacity-80
                  `}
                  href={link.href}
                  target={link.newTab ? "_blank" : "_self"}
                  rel={link.newTab ? "noopener noreferrer" : undefined}
                  prefetch={true}
                  onClick={close}
                >
                  {/* Text */}
                  {link.text}
                </Link>
              ) : (
                <div className="px-3 py-2 opacity-50">
                  {/* Text */}
                  {link.text}
                </div>
              )}

              {/* Sublinks */}
              {link.subLinks.length > 0 && (
                <div className="flex flex-col px-6">
                  {link.subLinks.map((sublink, i) => (
                    <Link
                      className={`
                        px-3 py-2 text-[15px] transition-opacity duration-200
                        hover:opacity-80
                      `}
                      key={i}
                      href={sublink.href}
                      target={sublink.newTab ? "_blank" : "_self"}
                      rel={sublink.newTab ? "noopener noreferrer" : undefined}
                      prefetch={true}
                      onClick={close}
                    >
                      {/* Text */}
                      {sublink.text}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavMenu;

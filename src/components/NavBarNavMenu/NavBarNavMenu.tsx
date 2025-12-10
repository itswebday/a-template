"use server";

import { getLocale } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import {
  ButtonLink,
  type ButtonLinkProps,
  LogoLink,
  TranslateButton,
} from "@/components";
import type { LocaleOption } from "@/types";
import { getButtonHref, getLinkHref, getMediaUrlAndAlt } from "@/utils";
import { getCachedGlobal, getCachedGlobals } from "@/utils/server";
import HamburgerButton from "./HamburgerButton";
import NavBar from "./NavBar";
import NavMenu from "./NavMenu";

type NavBarNavMenuProps = {
  className?: string;
};

const NavBarNavMenu: React.FC<NavBarNavMenuProps> = async ({ className }) => {
  const locale = (await getLocale()) as LocaleOption;
  const [navigation, globals] = await Promise.all([
    getCachedGlobal("navigation", locale)(),
    getCachedGlobals(locale)(),
  ]);
  const { url: logoUrl, alt: logoAlt } = getMediaUrlAndAlt(navigation?.logo);
  const links = (navigation?.links || []).map((link) => ({
    text: link.text || "",
    href: getLinkHref(link, globals),
    dropdown: link.dropdown || false,
    clickable: link.clickable || false,
    newTab: link.newTab || false,
    subLinks: (link.sublinks || []).map((sublink) => ({
      text: sublink.text || "",
      href: getLinkHref(sublink, globals),
      newTab: sublink.newTab || false,
    })),
  }));

  // Get button data from navigation
  const button = navigation?.button;
  const showButton = navigation?.showButton;
  const buttonHref = showButton ? getButtonHref(button, globals) : null;

  return (
    <nav
      className={twMerge(
        "z-95 w-full h-nav-bar px-4 bg-dark",
        "de:pl-6 de:pr-12",
        className,
      )}
    >
      {/* Container */}
      <div
        className={twMerge(
          "flex justify-between items-center gap-4 w-full h-full",
        )}
      >
        {/* Logo */}
        <LogoLink className="z-99 w-12 shrink-0" src={logoUrl} alt={logoAlt} />

        {/* Right side: NavBar, Button, Translate, Hamburger */}
        <div className="flex items-center gap-8 ml-auto">
          {/* Navigation bar (desktop) */}
          <NavBar className="hidden de:flex" links={links} />

          {/* Button (desktop only) */}
          {showButton && buttonHref && button?.text && (
            <div className="hidden de:block">
              <ButtonLink
                href={buttonHref}
                variant={button.variant as ButtonLinkProps["variant"]}
                target={button.newTab ? "_blank" : "_self"}
              >
                {button.text}
              </ButtonLink>
            </div>
          )}

          {/* Translate button */}
          <TranslateButton className="z-95 shrink-0" />

          {/* Hamburger button (mobile) */}
          <HamburgerButton className="z-95 flex de:hidden shrink-0" />
        </div>

        {/* Navigation menu (mobile) */}
        <NavMenu
          className="flex de:hidden"
          links={links}
          button={
            showButton && buttonHref && button?.text
              ? {
                  text: button.text,
                  href: buttonHref,
                  variant: button.variant as ButtonLinkProps["variant"],
                  target: button.newTab ? "_blank" : "_self",
                }
              : undefined
          }
          slideOutMenu={navigation?.slideOutMenu || false}
        />
      </div>
    </nav>
  );
};

export default NavBarNavMenu;

"use server";

import HamburgerButton from "./HamburgerButton";
import NavBar from "./NavBar";
import NavMenu from "./NavMenu";
import { LogoLink, TranslateButton } from "@/components";
import type { LocaleOption } from "@/types";
import { getLinkHref, getMediaUrlAndAlt } from "@/utils";
import { getGlobal } from "@/utils/server";
import { getLocale } from "next-intl/server";

type NavBarNavMenuProps = {
  className?: string;
};

const NavBarNavMenu: React.FC<NavBarNavMenuProps> = async ({ className }) => {
  const locale = (await getLocale()) as LocaleOption;
  const [
    navigation,
    home,
    blog,
    privacyPolicy,
    cookiePolicy,
    termsAndConditions,
  ] = await Promise.all([
    getGlobal("navigation", locale),
    getGlobal("home", locale),
    getGlobal("blog", locale),
    getGlobal("privacyPolicy", locale),
    getGlobal("cookiePolicy", locale),
    getGlobal("termsAndConditions", locale),
  ]);
  const { url: logoUrl, alt: logoAlt } = getMediaUrlAndAlt(navigation?.logo);
  const globals = {
    home,
    blog,
    privacyPolicy,
    cookiePolicy,
    termsAndConditions,
  };
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

  return (
    <nav
      className={`
        z-95 w-full h-nav-bar px-4 text-white bg-black
        de:px-12
        ${className}
      `}
    >
      {/* Container */}
      <div
        className={`
          flex justify-between items-center gap-2 w-full h-full
        `}
      >
        {/* Logo */}
        <LogoLink className="z-95 w-16" src={logoUrl} alt={logoAlt} />

        {/* Navigation bar (desktop) */}
        <NavBar className="hidden ml-auto de:flex" links={links} />

        {/* Translate button */}
        <TranslateButton className="z-95 ml-auto de:ml-8" />

        {/* Hamburger button (mobile) */}
        <HamburgerButton className="z-95 flex de:hidden" />

        {/* Navigation menu (mobile) */}
        <NavMenu
          className="flex de:hidden"
          links={links}
          slideOutMenu={navigation?.slideOutMenu || false}
        />
      </div>
    </nav>
  );
};

export default NavBarNavMenu;

"use server";

import FooterLink from "./FooterLink";
import type { LocaleOption } from "@/types";
import { getLinkHref } from "@/utils";
import { getGlobal } from "@/utils/server";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";

type FooterProps = {
  className?: string;
};

const Footer: React.FC<FooterProps> = async () => {
  const locale = (await getLocale()) as LocaleOption;
  const [footerT, homeT] = await Promise.all([
    getTranslations("footer"),
    getTranslations("home"),
  ]);
  const [footer, home, blog, privacyPolicy, cookiePolicy, termsAndConditions] =
    await Promise.all([
      getGlobal("footer", locale),
      getGlobal("home", locale),
      getGlobal("blog", locale),
      getGlobal("privacyPolicy", locale),
      getGlobal("cookiePolicy", locale),
      getGlobal("termsAndConditions", locale),
    ]);
  const globals = {
    home,
    blog,
    privacyPolicy,
    cookiePolicy,
    termsAndConditions,
  };

  return (
    <footer
      className={`
        bg-black text-white w-full pt-20 pb-12
      `}
    >
      {/* Container */}
      <div
        className={`
          flex flex-col gap-16 w-11/12 max-w-300 mx-auto text-[14px]
          de:flex-row de:items-start de:gap-8
        `}
      >
        {/* Contact */}
        <div className="flex flex-col de:w-1/3">
          {/* Heading */}
          <h6 className="mb-7 text-white">{footerT("contact.heading")}</h6>

          {/* Content */}
          <div className="flex flex-col gap-1">
            <span className="text-[12px] opacity-70">
              {footerT("contact.email")}
            </span>
            <FooterLink
              className="mb-4"
              href={`mailto:${footer?.email?.text || ""}`}
              target="_blank"
            >
              <span>{footer?.email?.text || ""}</span>
            </FooterLink>
            <span className="text-[12px] opacity-70">
              {footerT("contact.phone")}
            </span>
            <FooterLink
              href={`tel:${footer?.phone?.text?.replace(/\s/g, "") || ""}`}
              target="_blank"
            >
              <span>{footer?.phone?.text || ""}</span>
            </FooterLink>
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col de:w-1/3">
          {/* Heading */}
          <h6 className="mb-7 text-white">{footerT("location.heading")}</h6>

          {/* Content */}
          <div className="flex flex-col gap-1">
            <span className="text-[12px] opacity-80">
              {footerT("location.address")}
            </span>
            <FooterLink href={footer?.address?.href || ""} target="_blank">
              <span>{footer?.address?.text || ""}</span>
            </FooterLink>
          </div>
        </div>

        {/* Footer links */}
        <div className="flex flex-col mt-auto de:w-1/3">
          {/* Links */}
          <div className="flex flex-col gap-2 items-end">
            {(
              (
                footer as {
                  links?: Array<{
                    text?: string | null;
                    customHref?: boolean | null;
                    href?: string | null;
                    linkType?:
                      | "page"
                      | "home"
                      | "blog"
                      | "blog-post"
                      | "privacy-policy"
                      | "cookie-policy"
                      | "terms-and-conditions"
                      | null;
                    page?: {
                      relationTo: "pages" | "blog-posts";
                      value:
                        | number
                        | { url?: string | null; slug?: string | null }
                        | null;
                    } | null;
                    newTab?: boolean | null;
                  }>;
                } | null
              )?.links || []
            ).map((link, index) => (
              <FooterLink
                key={index}
                href={getLinkHref(link, globals)}
                target={link.newTab ? "_blank" : "_self"}
              >
                <span>{link.text || ""}</span>
              </FooterLink>
            ))}
          </div>
        </div>
      </div>

      {/* Container */}
      <div
        className={`
          flex flex-col pt-8 w-11/12 max-w-300 mx-auto
        `}
      >
        {/* Copyright */}
        <div
          className={`
            flex flex-col gap-2 pt-8 text-center text-[12px] opacity-70
            border-t border-white/20
            de:flex-row de:justify-between de:text-left
          `}
        >
          <span>
            ©{" "}
            <Link
              className="transition-opacity duration-200 hover:opacity-100"
              href={homeT("href")}
              prefetch={true}
            >
              A Template
            </Link>{" "}
            {new Date().getFullYear()}. All rights reserved.
          </span>
          <div className="flex flex-col gap-1 de:flex-row de:gap-4">
            <span>
              {footerT("legalLinks.kvk")}: {footer?.companyDetails?.kvk || ""}
            </span>
            <span>
              {footerT("legalLinks.vat")}: {footer?.companyDetails?.vat || ""}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

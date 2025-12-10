"use server";

import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import { LogoLink } from "@/components";
import type { Config, Media } from "@/payload-types";
import type { LocaleOption } from "@/types";
import { getLinkHref, getMediaUrlAndAlt } from "@/utils";
import { getCachedGlobal } from "@/utils/server";
import FooterLink from "./FooterLink";

type FooterProps = {
  className?: string;
};

const EmailIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const LocationIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const Footer: React.FC<FooterProps> = async ({ className }) => {
  const locale = (await getLocale()) as LocaleOption;
  const [footerT, homeT] = await Promise.all([
    getTranslations("footer"),
    getTranslations("home"),
  ]);
  const [footer, home, blog, privacyPolicy, cookiePolicy, termsAndConditions] =
    await Promise.all([
      getCachedGlobal("footer", locale)(),
      getCachedGlobal("home", locale)(),
      getCachedGlobal("blog", locale)(),
      getCachedGlobal("privacy-policy", locale)(),
      getCachedGlobal("cookie-policy", locale)(),
      getCachedGlobal("terms-and-conditions", locale)(),
    ] as [
      Promise<Config["globals"]["footer"]>,
      Promise<Config["globals"]["home"]>,
      Promise<Config["globals"]["blog"]>,
      Promise<Config["globals"]["privacy-policy"]>,
      Promise<Config["globals"]["cookie-policy"]>,
      Promise<Config["globals"]["terms-and-conditions"]>,
    ]);

  const globals = {
    home,
    blog,
    privacyPolicy,
    cookiePolicy,
    termsAndConditions,
  };

  const footerLogo =
    typeof footer?.logo === "object" && footer.logo !== null
      ? (footer.logo as Media)
      : null;
  const { url: logoUrl, alt: logoAlt } = getMediaUrlAndAlt(footerLogo);

  return (
    <footer
      className={twMerge(
        "w-full pt-12 pb-8 bg-dark border-t-2 border-white/10",
        "lg:pt-16 lg:pb-12",
        className,
      )}
    >
      {/* Container */}
      <div className="w-5/6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-8 lg:gap-12">
          {/* Top section */}
          <div
            className={twMerge(
              "grid grid-cols-1 gap-8",
              "sm:grid-cols-2",
              "lg:grid-cols-12 lg:gap-4",
            )}
          >
            {/* Logo, paragraph and social media */}
            <div
              className={twMerge(
                "flex flex-col gap-4",
                "lg:gap-6 lg:col-span-4",
              )}
            >
              {/* Logo */}
              {logoUrl && (
                <div className="relative w-36">
                  <LogoLink
                    className="h-full w-full"
                    src={logoUrl}
                    alt={logoAlt}
                  />
                </div>
              )}

              {/* Paragraph */}
              {footer?.Paragraph && (
                <p
                  className={twMerge(
                    "text-[14px] leading-relaxed text-white/70",
                    "max-w-md",
                  )}
                >
                  {footer.Paragraph}
                </p>
              )}

              {/* Social media links */}
              {footer?.socialMediaLinks &&
                footer.socialMediaLinks.length > 0 && (
                  <div className="flex flex-col gap-3 lg:gap-4">
                    {/* Heading */}
                    <h6
                      className={twMerge(
                        "text-[14px] font-semibold text-white mb-2",
                      )}
                    >
                      {footerT("socialMedia.heading")}
                    </h6>

                    {/* Links */}
                    <div className="flex gap-3 lg:gap-4">
                      {footer.socialMediaLinks
                        .filter((item) => item.href)
                        .map((item, index) => {
                          const media =
                            typeof item.icon === "object" && item.icon !== null
                              ? (item.icon as Media)
                              : null;
                          const { url: iconUrl, alt: iconAlt } =
                            getMediaUrlAndAlt(media);

                          return (
                            <Link
                              key={item.id || index}
                              className={twMerge(
                                "group flex items-center justify-center",
                                "w-10 h-10 rounded-full",
                                "bg-primary-purple/20 text-primary-purple",
                                "hover:bg-primary-purple hover:text-white",
                                "transition-all duration-300",
                                "lg:w-12 lg:h-12",
                              )}
                              href={item.href || ""}
                              target="_blank"
                              aria-label={`Social media link ${index + 1}`}
                            >
                              {iconUrl ? (
                                <span
                                  className={twMerge(
                                    "relative block h-5 w-5",
                                    "lg:h-6 lg:w-6",
                                  )}
                                >
                                  <Image
                                    className={twMerge(
                                      "object-contain",
                                      "transition-transform duration-300",
                                      "group-hover:scale-110",
                                    )}
                                    src={iconUrl}
                                    alt={iconAlt}
                                    fill={true}
                                    sizes="(max-width: 768px) 20px, 24px"
                                    loading="lazy"
                                  />
                                </span>
                              ) : (
                                <span
                                  className={twMerge(
                                    "text-[16px] font-semibold",
                                    "lg:text-[18px]",
                                  )}
                                >
                                  S
                                </span>
                              )}
                            </Link>
                          );
                        })}
                    </div>
                  </div>
                )}
            </div>

            {/* Contact information */}
            <div
              className={twMerge(
                "flex flex-col gap-4",
                "lg:gap-6 lg:col-span-4",
              )}
            >
              {/* Heading */}
              <h6
                className={twMerge("text-[14px] font-semibold text-white mb-2")}
              >
                {footerT("contact.heading")}
              </h6>

              <div className="flex flex-col gap-4 lg:gap-6">
                {/* Email */}
                {footer?.email?.text && (
                  <div className="flex items-center gap-3 lg:gap-4">
                    {/* Icon */}
                    <div
                      className={twMerge(
                        "flex items-center justify-center",
                        "w-12 h-12 p-3 rounded-full",
                        "bg-primary-purple/20 text-primary-purple",
                        "shrink-0",
                        "lg:w-14 lg:h-14",
                      )}
                    >
                      <EmailIcon />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col gap-1">
                      <span
                        className={twMerge(
                          "text-[10px] font-medium text-white/60",
                          "uppercase tracking-wide",
                        )}
                      >
                        {footerT("contact.email")}
                      </span>
                      <FooterLink
                        href={`mailto:${footer.email.text}`}
                        target="_blank"
                      >
                        <span
                          className={twMerge(
                            "text-[14px] font-medium text-white",
                            "hover:text-primary-purple",
                            "transition-colors duration-200",
                          )}
                        >
                          {footer.email.text}
                        </span>
                      </FooterLink>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {footer?.phone?.text && (
                  <div className="flex items-center gap-3 lg:gap-4">
                    {/* Icon */}
                    <div
                      className={twMerge(
                        "flex items-center justify-center",
                        "w-12 h-12 p-3 rounded-full",
                        "bg-primary-purple/20 text-primary-purple",
                        "shrink-0",
                        "lg:w-14 lg:h-14",
                      )}
                    >
                      <PhoneIcon />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col gap-1">
                      <span
                        className={twMerge(
                          "text-[10px] font-medium text-white/60",
                          "uppercase tracking-wide",
                        )}
                      >
                        {footerT("contact.phone")}
                      </span>
                      <FooterLink
                        href={`tel:${footer.phone.text.replace(/\s/g, "")}`}
                        target="_blank"
                      >
                        <span
                          className={twMerge(
                            "text-[14px] font-medium text-white",
                            "hover:text-primary-purple",
                            "transition-colors duration-200",
                          )}
                        >
                          {footer.phone.text}
                        </span>
                      </FooterLink>
                    </div>
                  </div>
                )}

                {/* Address */}
                {footer?.address?.text && (
                  <div className="flex items-center gap-3 lg:gap-4">
                    {/* Icon */}
                    <div
                      className={twMerge(
                        "flex items-center justify-center",
                        "w-12 h-12 p-3 rounded-full",
                        "bg-primary-purple/20 text-primary-purple",
                        "shrink-0",
                        "lg:w-14 lg:h-14",
                      )}
                    >
                      <LocationIcon />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col gap-1">
                      <span
                        className={twMerge(
                          "text-[10px] font-medium text-white/60",
                          "uppercase tracking-wide",
                        )}
                      >
                        {footerT("location.address")}
                      </span>
                      {footer.address.href ? (
                        <FooterLink href={footer.address.href} target="_blank">
                          <span
                            className={twMerge(
                              "text-[14px] font-medium text-white",
                              "hover:text-primary-purple",
                              "transition-colors duration-200",
                            )}
                          >
                            {footer.address.text}
                          </span>
                        </FooterLink>
                      ) : (
                        <span
                          className={twMerge(
                            "text-[14px] font-medium text-white",
                          )}
                        >
                          {footer.address.text}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick links */}
            {footer?.quickLinks && footer.quickLinks.length > 0 && (
              <div
                className={twMerge(
                  "flex flex-col gap-3",
                  "lg:gap-4 lg:col-span-2",
                )}
              >
                {/* Heading */}
                <h6
                  className={twMerge(
                    "text-[14px] font-semibold text-white mb-2",
                  )}
                >
                  {footerT("quickLinks.heading")}
                </h6>

                {/* Links */}
                <div className="flex flex-col gap-2 lg:gap-3">
                  {footer.quickLinks.map((link, index) => {
                    const linkHref = getLinkHref(link, globals);

                    if (!linkHref || !link.text) {
                      return null;
                    }

                    return (
                      <FooterLink
                        key={index}
                        href={linkHref}
                        target={link.newTab ? "_blank" : "_self"}
                      >
                        <span
                          className={twMerge(
                            "text-[14px] text-white/80",
                            "hover:text-primary-purple",
                            "transition-colors duration-200",
                          )}
                        >
                          {link.text}
                        </span>
                      </FooterLink>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Services */}
            {footer?.services && footer.services.length > 0 && (
              <div
                className={twMerge(
                  "flex flex-col gap-3",
                  "lg:gap-4 lg:col-span-2",
                )}
              >
                {/* Heading */}
                <h6
                  className={twMerge(
                    "text-[14px] font-semibold text-white mb-2",
                  )}
                >
                  {footerT("services.heading")}
                </h6>

                {/* Links */}
                <div className="flex flex-col gap-2 lg:gap-3">
                  {footer.services.map((link, index) => {
                    const linkHref = getLinkHref(link, globals);

                    if (!linkHref || !link.text) {
                      return null;
                    }

                    return (
                      <FooterLink
                        key={index}
                        href={linkHref}
                        target={link.newTab ? "_blank" : "_self"}
                      >
                        <span
                          className={twMerge(
                            "text-[14px] text-white/80",
                            "hover:text-primary-purple",
                            "transition-colors duration-200",
                          )}
                        >
                          {link.text}
                        </span>
                      </FooterLink>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div
        className={twMerge(
          "w-11/12 max-w-6xl mx-auto mt-8 pt-6",
          "border-t-2 border-white/10",
          "lg:mt-12 lg:pt-8",
        )}
      >
        {/* Legal links */}
        {footer?.legalLinks && footer.legalLinks.length > 0 && (
          <div
            className={twMerge(
              "flex flex-wrap justify-center gap-4 mb-6",
              "lg:justify-start lg:gap-6 lg:mb-8",
            )}
          >
            {footer.legalLinks.map((link, index) => {
              const linkHref = getLinkHref(link, globals);

              if (!linkHref || !link.text) {
                return null;
              }

              return (
                <FooterLink
                  key={index}
                  href={linkHref}
                  target={link.newTab ? "_blank" : "_self"}
                >
                  <span
                    className={twMerge(
                      "text-[12px] text-white/60",
                      "hover:text-primary-purple",
                      "transition-colors duration-200",
                    )}
                  >
                    {link.text}
                  </span>
                </FooterLink>
              );
            })}
          </div>
        )}

        {/* Copyright and company details */}
        <div
          className={twMerge(
            "flex flex-col gap-3 text-center text-[12px] text-white/60",
            "lg:flex-row lg:justify-between lg:gap-4 lg:text-left",
          )}
        >
          {/* Copyright */}
          <div>
            <span>
              ©{" "}
              <Link
                className={twMerge(
                  "font-medium text-white",
                  "hover:text-primary-purple",
                  "transition-colors duration-200",
                )}
                href={homeT("href")}
                prefetch={true}
              >
                A Template
              </Link>{" "}
              {new Date().getFullYear()}. All rights reserved.
            </span>
          </div>

          {/* Company details */}
          <div className="flex flex-col gap-2 lg:flex-row lg:gap-6">
            {footer?.companyDetails?.kvk && (
              <span>
                {footerT("legalLinks.kvk")}:{" "}
                <span className="font-medium text-white">
                  {footer.companyDetails.kvk}
                </span>
              </span>
            )}
            {footer?.companyDetails?.vat && (
              <span>
                {footerT("legalLinks.vat")}:{" "}
                <span className="font-medium text-white">
                  {footer.companyDetails.vat}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

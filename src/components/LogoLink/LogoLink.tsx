"use client";

import { DEFAULT_LOCALE } from "@/constants";
import { useNavMenu } from "@/contexts";
import { LocaleOption } from "@/types";
import { scrollToTop } from "@/utils";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type LogoLinkProps = {
  className?: string;
  src: string;
  alt: string;
};

const LogoLink: React.FC<LogoLinkProps> = ({ className, src, alt }) => {
  const locale = useLocale() as LocaleOption;
  const navMenu = useNavMenu();
  const pathname = usePathname();

  return (
    <Link
      className={`
        relative
        ${className}
      `}
      href={`${locale === DEFAULT_LOCALE ? "/" : `/${locale}`}`}
      prefetch={true}
      onClick={(e) => {
        navMenu.close();

        if (pathname === `${locale === DEFAULT_LOCALE ? "/" : `/${locale}`}`) {
          e.preventDefault();
          scrollToTop();
        }
      }}
    >
      {/* Logo */}
      <Image
        className="object-contain"
        src={src}
        alt={alt}
        width={512}
        height={512}
        priority={true}
      />
    </Link>
  );
};

export default LogoLink;

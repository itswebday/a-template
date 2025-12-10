"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { DEFAULT_LOCALE } from "@/constants";
import { useNavMenu } from "@/contexts";
import type { LocaleOption } from "@/types";
import { scrollToTop } from "@/utils";

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
      className={twMerge("relative", className)}
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

"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { NavLink } from "@/components";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import { usePage } from "@/contexts";
import type { LocaleOption } from "@/types";
import { request } from "@/utils";

type LocalizedRoutesResponse = {
  localizedUrls: Record<LocaleOption, string>;
  status: number;
};

type TranslateButtonProps = {
  className?: string;
};

const TranslateButton: React.FC<TranslateButtonProps> = ({ className }) => {
  const currentLocale = useLocale() as LocaleOption;
  const generalT = useTranslations("general");
  const { currentPage, currentSlug } = usePage();
  const [translatedUrls, setTranslatedUrls] = useState<Record<
    LocaleOption,
    string
  > | null>(null);

  useEffect(() => {
    if (!currentPage) {
      return;
    }

    const fetchTranslatedUrls = async () => {
      try {
        await request<LocalizedRoutesResponse>(
          "GET",
          "/api/localized-routes",
          currentLocale,
          {
            searchParams: {
              pageLabel: currentPage,
              pageSlug: currentSlug,
            },
            defaultErrorMessage: generalT("errors.localizedUrls"),
            setData: (data) => {
              if (data) {
                setTranslatedUrls(data.localizedUrls);
              }
            },
          },
        );
      } catch {
        setTranslatedUrls(null);
      }
    };

    fetchTranslatedUrls();
  }, [currentPage, currentSlug, currentLocale]);

  return (
    <div className={twMerge("flex items-center gap-2", className)}>
      {LOCALES.map((locale, index) => {
        return (
          <div className="flex items-center gap-2" key={locale}>
            <NavLink
              className={twMerge(
                "px-2 text-[12px] text-white transition-opacity duration-200",
                locale === currentLocale && "opacity-70",
              )}
              href={
                locale === currentLocale
                  ? undefined
                  : translatedUrls?.[locale] ||
                    (locale === DEFAULT_LOCALE ? "/" : `/${locale}`)
              }
            >
              {locale.toUpperCase()}
            </NavLink>
            {index < LOCALES.length - 1 && (
              <div className="w-px h-4 bg-white" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TranslateButton;

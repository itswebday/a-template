import type { ReactNode } from "react";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import * as evolv365 from "itswebday/evolv365";
import * as zubaidshah from "itswebday/zubaidshah";
import "itswebday/tenants/styles.css";
import { routing } from "@/i18n/routing";

const TENANT_MODULES = {
  evolv365,
  zubaidshah,
} as const;

const getTenant = () => {
  const slug = process.env
    .NEXT_PUBLIC_TENANT_SLUG as keyof typeof TENANT_MODULES;

  if (!slug || !(slug in TENANT_MODULES)) {
    throw new Error(
      "NEXT_PUBLIC_TENANT_SLUG is required and must be a valid tenant " +
        "(evolv365, zubaidshah).",
    );
  }

  return TENANT_MODULES[slug];
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const generateMetadata = () => {
  const tenant = getTenant();

  return tenant.metadata ?? {};
};

type PageLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>;

const PageLayout = async ({ children, params }: PageLayoutProps) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const tenant = getTenant();
  const HomeLayout = tenant.HomeLayout;

  return <HomeLayout>{children}</HomeLayout>;
};

export default PageLayout;

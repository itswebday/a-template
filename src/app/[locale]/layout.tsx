import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { routing } from "@/i18n/routing";
import "itswebday/tenants/styles.css";

const tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG ?? "";

const getTenant = async () => {
  if (!tenantSlug) {
    throw new Error("NEXT_PUBLIC_TENANT_SLUG is required for the main app.");
  }

  return import(`itswebday/${tenantSlug}`);
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

  const tenant = await getTenant();
  const HomeLayout = tenant.HomeLayout;

  return <HomeLayout>{children}</HomeLayout>;
};

export default PageLayout;

export const generateMetadata = async () => {
  const tenant = await getTenant();

  return tenant.metadata ?? {};
};

export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locale }));
};

import type { ReactNode } from "react";
import "itswebday/tenants/styles.css";

const tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG ?? "";

const getTenant = async () => {
  if (!tenantSlug) {
    throw new Error("NEXT_PUBLIC_TENANT_SLUG is required for the main app.");
  }

  return import(`itswebday/${tenantSlug}`);
};

export const generateMetadata = async () => {
  const tenant = await getTenant();

  return tenant.metadata ?? {};
};

type PageLayoutProps = Readonly<{
  children: ReactNode;
}>;

const PageLayout = async ({ children }: PageLayoutProps) => {
  const tenant = await getTenant();
  const HomeLayout = tenant.HomeLayout;

  return <HomeLayout>{children}</HomeLayout>;
};

export default PageLayout;

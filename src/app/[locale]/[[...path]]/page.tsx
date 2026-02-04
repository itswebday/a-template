import { renderPage } from "itswebday";
import { getPage, getPagePaths } from "itswebday/data";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import { getSectionRegistry } from "@/utils/itswebday";
import { createSupabaseAnonClient } from "@/utils/supabase/server";

const page = renderPage({
  createSupabaseClient: createSupabaseAnonClient,
  tenantSlug: process.env.NEXT_PUBLIC_TENANT_SLUG ?? "",
  getSectionRegistry,
  getCachedPage: getPage,
  getCachedPagePaths: getPagePaths,
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  baseUrl: process.env.NEXT_PUBLIC_APP_URL ?? "",
  revalidate: 3600,
  useDraftMode: false,
});

export default page.default;

export const generateMetadata = async (
  props: Parameters<typeof page.generateMetadata>[0],
) => page.generateMetadata(props);

export const generateStaticParams = async () => page.generateStaticParams();

export const revalidate = 3600;

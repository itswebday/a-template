import { renderPage } from "itswebday";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import { getSectionRegistry } from "@/lib/itswebday";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const page = renderPage({
  createSupabaseClient: createSupabaseServerClient,
  tenantSlug: process.env.NEXT_PUBLIC_TENANT_SLUG ?? "",
  getSectionRegistry,
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  baseUrl: process.env.NEXT_PUBLIC_APP_URL ?? "",
  revalidate: 3600,
});

export default page.default;

export const generateMetadata = async (
  props: Parameters<typeof page.generateMetadata>[0],
) => page.generateMetadata(props);

export const generateStaticParams = async () => page.generateStaticParams();

export const revalidate = 3600;

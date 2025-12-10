import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import {
  CookieNotification,
  Footer,
  NavBarNavMenu,
  PreviewListener,
} from "@/components";
import { NavMenuProvider, PageProvider } from "@/contexts";

const getServerSideURL = () => {
  return process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
};

const HomeLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;

  return (
    <NextIntlClientProvider>
      <html lang={locale} suppressHydrationWarning>
        <head>
          <link href="/favicon.ico" rel="icon" sizes="32x32" />
          <link href="/icon.svg" rel="icon" type="image/svg+xml" />
          <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
        </head>

        <body className="text-[15px] font-open-sans">
          <PageProvider initialPage="">
            <NavMenuProvider>
              <PreviewListener />
              <NavBarNavMenu />
              {children}
              <Footer />
              <CookieNotification />
            </NavMenuProvider>
          </PageProvider>
        </body>
      </html>
    </NextIntlClientProvider>
  );
};

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
};

export default HomeLayout;

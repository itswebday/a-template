import {
  CookieNotification,
  Footer,
  NavBarNavMenu,
  PreviewListener,
} from "@/components";
import { NavMenuProvider, PageProvider } from "@/contexts";
import { NextIntlClientProvider } from "next-intl";

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
          <PageProvider initialPage="home">
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

export default HomeLayout;

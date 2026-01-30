import type { Metadata } from "next";
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
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
            rel="stylesheet"
          />
          <link
            href="/favicon.ico"
            rel="icon"
            type="image/x-icon"
            sizes="any"
          />
          <link href="/icon.svg" rel="icon" type="image/svg+xml" />
          <link
            href="/apple-touch-icon.png"
            rel="apple-touch-icon"
            sizes="125x125"
          />
        </head>

        <body className="text-[15px] text-white font-montserrat bg-black">
          {children}
        </body>
      </html>
    </NextIntlClientProvider>
  );
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
};

export default HomeLayout;

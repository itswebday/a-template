import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n";

const intlMiddleware = createMiddleware(routing);

export const proxy = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/webstudio")) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
};

export default proxy;

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

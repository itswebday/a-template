import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import { handleApiError } from "@/utils/server";

export const GET = async (request: Request) => {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Only check auth if CRON_SECRET is set
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return handleApiError(null, "Unauthorized", 401);
    }

    // Revalidate frequently accessed pages to keep cache fresh
    const pathsToRevalidate: string[] = [];

    // Revalidate home pages for all locales
    for (const locale of LOCALES) {
      pathsToRevalidate.push(locale === DEFAULT_LOCALE ? "/" : `/${locale}`);
    }

    // Revalidate all paths
    for (const path of pathsToRevalidate) {
      revalidatePath(path);
    }

    // Success response
    return NextResponse.json({
      ok: true,
      revalidated: pathsToRevalidate.length,
      paths: pathsToRevalidate,
      timestamp: new Date().toISOString(),
    });
  } catch (errorResponse) {
    // Error response
    return handleApiError(errorResponse, "Cron job error", 500);
  }
};

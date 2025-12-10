import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { PayloadRequest } from "payload";
import { NextRequest } from "next/server";
import { getCachedPayload, handleApiError } from "@/utils/server";

const isRedirectError = (error: unknown): boolean => {
  return (
    error !== null &&
    typeof error === "object" &&
    "digest" in error &&
    typeof error.digest === "string" &&
    error.digest.startsWith("NEXT_REDIRECT")
  );
};

export const GET = async (
  request: NextRequest,
  _context: { params: Promise<Record<string, never>> },
): Promise<Response> => {
  try {
    // Get Payload instance and search parameters
    const payload = await getCachedPayload();
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");
    const previewSecret = searchParams.get("previewSecret");

    // Validate preview secret
    if (previewSecret !== process.env.PREVIEW_SECRET) {
      return handleApiError(
        null,
        "You are not allowed to preview this page",
        403,
      );
    }

    // Validate path parameter
    if (!path) {
      return handleApiError(null, "Insufficient search params", 400);
    }

    if (!path.startsWith("/")) {
      return handleApiError(
        null,
        "This endpoint can only be used for relative previews",
        400,
      );
    }

    // Authenticate user
    let user;

    // Authenticate user
    try {
      user = await payload.auth({
        req: request as unknown as PayloadRequest,
        headers: request.headers,
      });
    } catch {
      return handleApiError(
        null,
        "You are not allowed to preview this page",
        403,
      );
    }

    // Enable draft mode and redirect
    const draft = await draftMode();

    // Disable draft mode if user is not authenticated
    if (!user) {
      draft.disable();

      // Error response
      return handleApiError(
        null,
        "You are not allowed to preview this page",
        403,
      );
    }

    // Enable draft mode and redirect
    draft.enable();

    // Redirect to path
    redirect(path);
  } catch (errorResponse) {
    // Re-throw redirect errors to allow Next.js to handle them
    if (isRedirectError(errorResponse)) {
      throw errorResponse;
    }

    // Error response
    return handleApiError(
      errorResponse,
      "Failed to process preview request",
      500,
    );
  }
};

import { NextResponse } from "next/server";

/**
 * Keep-warm endpoint to prevent cold starts
 * This endpoint should be pinged periodically to keep serverless functions warm
 */
export const GET = async () => {
  try {
    // Pre-warm the Payload client
    const { getCachedPayload } = await import("@/utils/payload");
    await getCachedPayload();
  } catch (error) {
    // Silently fail - this is just a warm-up call
    console.warn("Keep-warm: Failed to pre-warm Payload client", error);
  }

  // Success response
  return NextResponse.json({
    ok: true,
    message: "Function warmed up",
    timestamp: new Date().toISOString(),
  });
};

import type { LocaleOption } from "@/types";
import { getMessages } from "next-intl/server";
import { NextResponse } from "next/server";

export const handleApiError = async (
  errorResponse: unknown,
  locale: LocaleOption,
): Promise<NextResponse> => {
  console.error("Error response:", errorResponse);

  const messages = await getMessages({ locale });

  let response: NextResponse;

  // Error response
  if (
    errorResponse &&
    typeof errorResponse === "object" &&
    "data" in errorResponse
  ) {
    response = NextResponse.json(errorResponse);
  } else {
    // Internal server error
    response = NextResponse.json(
      { data: { errors: [{ message: messages.errors.serverError }] } },
      { status: 500 },
    );
  }

  return response;
};

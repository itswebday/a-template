import { NextResponse } from "next/server";

export const handleApiError = async (
  errorResponse: unknown,
): Promise<NextResponse> => {
  console.error("Error response:", errorResponse);

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
      { data: { errors: [{ message: "Internal server error" }] } },
      { status: 500 },
    );
  }

  return response;
};

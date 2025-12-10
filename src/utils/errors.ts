import { NextResponse } from "next/server";

export const handleApiError = async (
  errorResponse: unknown,
  errorMessage?: string,
  status?: number,
): Promise<NextResponse> => {
  console.error("Error response:", errorResponse);

  let response: NextResponse;

  // Error response
  if (
    errorResponse !== null &&
    errorResponse !== undefined &&
    typeof errorResponse === "object" &&
    "data" in errorResponse
  ) {
    response = NextResponse.json(errorResponse, {
      status: status || 500,
    });
  } else {
    // Internal server error
    response = NextResponse.json(
      {
        data: {
          errors: [{ message: errorMessage || "Internal server error" }],
        },
      },
      { status: status || 500 },
    );
  }

  return response;
};

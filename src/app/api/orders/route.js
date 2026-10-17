import { NextResponse } from "next/server";
import { validateOrder } from "@/app/lib/validate-order";

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_JSON",
          message: "The request body must contain valid JSON.",
        },
      },
      { status: 400 },
    );
  }

  const result = validateOrder(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Please correct the submitted fields.",
          fieldErrors: result.fieldErrors,
        },
      },
      { status: 422 },
    );
  }

  // This route validates the order but does not persist it.
  return NextResponse.json(
    {
      message: "Order validated successfully.",
      order: result.order,
    },
    { status: 200 },
  );
}

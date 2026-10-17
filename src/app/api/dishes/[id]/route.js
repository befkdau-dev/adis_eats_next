import { NextResponse } from "next/server";
import { getDish } from "@/app/lib/menu";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!/^\d+$/.test(id)) {
      return NextResponse.json(
        {
          error: {
            code: "DISH_NOT_FOUND",
            message: `Dish "${id}" was not found.`,
          },
        },
        { status: 404 },
      );
    }

    const dish = getDish(id);

    if (!dish) {
      return NextResponse.json(
        {
          error: {
            code: "DISH_NOT_FOUND",
            message: `Dish "${id}" was not found.`,
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ dish }, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to retrieve the dish.",
        },
      },
      { status: 500 },
    );
  }
}

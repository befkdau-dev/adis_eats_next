import { NextResponse } from "next/server";
import { getDish } from "@/app/lib/dishes";

export async function GET(request, { params }) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  const dish = await getDish(id);
  if (!dish) {
    return NextResponse.json(
      { error: `no dish found with id: ${id}` },
      { status: 404 },
    );
  }

  return NextResponse.json({ dish });
}

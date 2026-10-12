import { NextResponse } from "next/server";
import { getDishBySlug } from "@/app/lib/dishes";

export async function GET(request, { params }) {
  const { slug } = await params;
  const id = Number(rawId);

  const dish = await getDishBySlug(slug);
  if (!dish) {
    return NextResponse.json(
      { error: `no dish found with id: ${id}` },
      { status: 404 },
    );
  }

  return NextResponse.json({ dish });
}

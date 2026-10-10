// app/api/dishes/route.js
import { NextResponse } from "next/server";
import { getMenu } from "@/app/lib/dishes";

const PAGE_SIZE = 3;

export async function GET(request) {
  const dishes = await getMenu();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search")?.trim().toLowerCase();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  let results = dishes;

  if (category && category !== "All") {
    results = results.filter((dish) => dish.category === category);
  }

  if (search) {
    results = results.filter(
      (dish) =>
        dish.name.toLowerCase().includes(search) ||
        dish.description.toLowerCase().includes(search),
    );
  }

  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageItems = results.slice(start, start + PAGE_SIZE);

  return NextResponse.json({
    dishes: pageItems,
    page: safePage,
    totalPages,
    total,
  });
}

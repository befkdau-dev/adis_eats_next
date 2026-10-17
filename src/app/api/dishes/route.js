import { getMenu } from "@/app/lib/menu";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = (searchParams.get("q") || "").trim().toLowerCase();

    const requestedPage = Number(searchParams.get("page") || 1);
    const requestedPageSize = Number(searchParams.get("limit") || 6);

    const page =
      Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

    const pageSize =
      Number.isInteger(requestedPageSize) && requestedPageSize > 0
        ? Math.min(requestedPageSize, 24)
        : 6;

    const allDishes = getMenu();

    const filteredDishes = allDishes.filter((dish) => {
      const searchableText = [
        dish.name,
        dish.description,
        dish.category,
        ...(Array.isArray(dish.ingredients) ? dish.ingredients : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });

    const total = filteredDishes.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;

    const dishes = filteredDishes.slice(start, start + pageSize);

    return Response.json({
      dishes,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    });
  } catch {
    return Response.json(
      {
        error: {
          code: "DISH_FETCH_FAILED",
          message: "Unable to load dishes.",
        },
      },
      { status: 500 },
    );
  }
}

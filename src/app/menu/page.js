// app/menu/page.js
import { Suspense } from "react";
import { getMenu } from "../lib/dishes";
import DishListSkeleton from "./DishListSkeleton";
import DishList from "./DishList";
import FilterShell from "./FilterShell";
import MenuPager from "./MenuPager";

const PAGE_SIZE = 3;
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Menu",
  description: "Adiss Eats Menus",
};

export default async function MenuPage({ searchParams }) {
  const { category, page: pageParam } = await searchParams;
  const dishes = await getMenu();

  const filtered =
    category && category !== "All"
      ? dishes.filter((d) => d.category === category)
      : dishes;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  return (
    <Suspense fallback={<DishListSkeleton />}>
      <FilterShell>
        <DishList dishes={pageItems} />
        {totalPages > 1 && <MenuPager page={page} totalPages={totalPages} />}
      </FilterShell>
    </Suspense>
  );
}

import { Suspense } from "react";
import { getMenu } from "@/app/lib/menu";
import SearchBox from "./SearchBox";
import DishList from "./components/DishList";
import CategoryBar from "./components/CategoryBar";
import FilterShell from "./FilterShell";
import DishListSkeleton from "./components/DishListSkeleton";

export const revalidate = 3600;

export const metadata = {
  title: "Ethiopian Food, Delivered",
  description:
    "Explore Ethiopian dishes and discover your next favorite meal with Adis Eats.",
};
export default async function MenuPage() {
  const dishes = await getMenu();

  return (
    <div>
      <CategoryBar />

      <FilterShell>
        <Suspense fallback={<DishListSkeleton />}>
          <Suspense
            fallback={
              <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-gray-500">
                Loading search...
              </div>
            }
          >
            <SearchBox />
          </Suspense>
          <DishList dishes={dishes} />
        </Suspense>
      </FilterShell>
    </div>
  );
}

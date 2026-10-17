import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/app/components/AddToCartButton";

export default function DishList({ dishes }) {
  const categories = [
    { name: "Main Course", id: "main-course" },
    { name: "Vegetarian", id: "vegetarian" },
    { name: "Breakfast", id: "breakfast" },
  ];

  return (
    <div className="space-y-10">
      <section id="all-dishes" className="scroll-mt-24">
        <h2 className="mb-5 text-2xl font-bold text-[#193b2a]">All Dishes</h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      </section>

      {categories.map((category) => {
        const categoryDishes = dishes.filter(
          (dish) => dish.category === category.name,
        );

        if (categoryDishes.length === 0) return null;

        return (
          <section key={category.id} id={category.id} className="scroll-mt-24">
            <h2 className="mb-5 text-2xl font-bold text-[#193b2a]">
              {category.name}
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {categoryDishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function DishCard({ dish }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#e9e7dc] bg-white transition hover:-translate-y-1 hover:shadow-md">
      <Link
        href={`/menu/${dish.slug}`}
        className="block"
        aria-label={`View ${dish.name}`}
      >
        <div className="relative aspect-[4/3] bg-[#edf2e9]">
          <Image
            src={`/${dish.image.replace(/^\/+/, "")}`}
            alt={dish.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold text-[#193b2a]">{dish.name}</h3>

            <span className="shrink-0 font-bold text-[#bd7137]">
              {dish.price.toLocaleString("en-US")} ETB
            </span>
          </div>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
            {dish.description}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                dish.isAvailable
                  ? "bg-[#edf2e9] text-[#193b2a]"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {dish.isAvailable ? "Available" : "Unavailable"}
            </span>

            <span className="text-sm font-semibold text-[#193b2a]">
              View details →
            </span>
            <AddToCartButton dish={dish} />
          </div>
        </div>
      </Link>
    </article>
  );
}

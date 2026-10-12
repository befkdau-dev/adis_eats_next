// app/menu/DishList.js
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

export default function DishList({ dishes }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {dishes.map((dish, index) => (
        <div
          key={dish.id}
          className="rounded-lg border border-gray-200 overflow-hidden hover:shadow-md hover:border-orange-300 transition"
        >
          <div className="relative w-full aspect-[4/3] bg-gray-100">
            <Image
              src={`/${dish.image}`}
              alt={dish.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              priority={index === 0}
            />
            {!dish.isAvailable && (
              <span className="absolute top-2 right-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                Unavailable
              </span>
            )}
          </div>

          <div className="p-4">
            <h2 className="font-semibold text-lg">{dish.name}</h2>
            <p className="text-sm text-gray-600 line-clamp-2">
              {dish.description}
            </p>

            <div className="mt-2">
              <span className="text-orange-600 font-medium">
                {dish.price} birr
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Link
                href={`/menu/${dish.slug}`}
                className="flex-1 text-center text-sm border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50 transition"
              >
                View details
              </Link>
              <AddToCartButton dish={dish} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

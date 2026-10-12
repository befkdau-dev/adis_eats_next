import Image from "next/image";
import { notFound } from "next/navigation";
import { getDishBySlug, getMenu } from "@/app/lib/dishes";
import AddToCartButton from "../AddToCartButton";

export async function generateStaticParams() {
  const menu = await getMenu();
  return menu.map((dish) => ({ slug: dish.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const dish = await getDishBySlug(slug);
  if (!dish) return {};

  return {
    title: dish.name,
    description: dish.description,
  };
}

export default async function DishPage({ params }) {
  const { slug } = await params;
  const dish = await getDishBySlug(slug);

  if (!dish) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.description,
    offers: {
      "@type": "Offer",
      price: dish.price,
      priceCurrency: "ETB",
      availability: dish.isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="max-w-5xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid gap-8 md:grid-cols-2 md:items-start">
        {/* Image */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
          <Image
            src={`/${dish.image}`}
            alt={dish.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-medium text-gray-700 px-2.5 py-1 rounded-full shadow-sm">
            {dish.category}
          </span>
          {!dish.isAvailable && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
              Unavailable
            </span>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{dish.name}</h1>
          <p className="mt-2 text-gray-600 leading-relaxed">
            {dish.description}
          </p>

          <div className="mt-5 flex items-center gap-4">
            <span className="text-2xl font-bold text-orange-600">
              {dish.price} birr
            </span>
            {!dish.isAvailable && (
              <span className="text-sm text-red-500 font-medium">
                Currently unavailable
              </span>
            )}
          </div>

          <div className="mt-6">
            <AddToCartButton dish={dish} />
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-500 mb-3">
              Ingredients
            </h2>
            <div className="flex flex-wrap gap-2">
              {dish.ingredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="text-sm bg-orange-50 text-orange-700 border border-orange-100 px-3 py-1 rounded-full"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

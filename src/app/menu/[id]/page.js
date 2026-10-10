import { notFound } from "next/navigation";
import { getDish } from "@/app/lib/dishes";
import { getMenu } from "@/app/lib/dishes";
import Image from "next/image";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = await getDish(id);
  if (!dish) {
    return { title: "dish not found" };
  }

  return {
    title: dish.name,
    description: `${dish.name}- ${dish.price} ETB - ${dish.description}`,
  };
}
export async function generateStaticParams() {
  const dishes = await getMenu();
  return dishes.map((dish) => ({ id: String(dish.id) }));
}

export default async function Dishpage({ params }) {
  const { id } = await params;
  const dish = await getDish(id);
  if (!dish) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Menuitem",
    name: dish.name,
    description: dish.description,
    offers: {
      "@type": "offer",
      price: dish.price,
      priceCurrency: "ETB",
      availablitiy: dish.isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    suitableForDiet:
      dish.category === "Vegetrian"
        ? "https://schema.org/VegetarianDiet"
        : undefined,
  };
  return (
    <div className="max-w-2xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-gray-100 mb-4">
        <Image
          src={`/${dish.image}`}
          alt={dish.name}
          fill
          sizes="(max-width: 768px) 100vw, 672px"
          className="object-cover"
          priority
        />
      </div>
      <h1 className="text-2xl font-bold">{dish.name}</h1>
      <p className="text-gray-600 mt-2">{dish.description}</p>
      <p className="text-orange-600 font-semibold text-lg mt-3">
        {dish.price} birr
      </p>
    </div>
  );
}

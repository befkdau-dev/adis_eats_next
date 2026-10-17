import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDishBySlug, getMenu } from "@/app/lib/menu";
import { getDish } from "@/app/lib/menu";

export function generateStaticParams() {
  return getMenu().map((dish) => ({
    slug: dish.slug,
  }));
}

export const dynamicParams = false;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const dish = await getDish(slug);

  if (!dish) {
    return { title: "Dish Not Found" };
  }

  const imageUrl = new URL(dish.image, siteUrl).toString();

  return {
    title: dish.name,
    description: `${dish.description} Price: ${dish.price} ETB.`,

    openGraph: {
      title: `${dish.name} — ${dish.price} ETB`,
      description: dish.description,
      url: `/menu/${slug}`,
      type: "website",
      images: [
        {
          url: imageUrl,
          alt: dish.name,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: dish.name,
      description: dish.description,
      images: [imageUrl],
    },
  };
}

function DishJsonLd({ dish }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.description,
    image: new URL(dish.image, siteUrl).toString(),
    url: new URL(`/menu/${dish.slug}`, siteUrl).toString(),
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
export default async function DishPage({ params }) {
  const { slug } = await params;
  const dish = getDishBySlug(slug);

  if (!dish) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/menu"
        className="mb-6 inline-flex items-center gap-2 font-semibold text-[#bd7137] hover:text-[#193b2a]"
      >
        <span aria-hidden="true">←</span>
        Back to menu
      </Link>

      <div className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#edf2e9]">
          <Image
            src={`/${dish.image.replace(/^\/+/, "")}`}
            alt={dish.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="py-2">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#bd7137]">
            {dish.category}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#193b2a] sm:text-4xl">
            {dish.name}
          </h1>

          <p className="mt-5 leading-7 text-gray-600">{dish.description}</p>

          <p className="mt-6 text-3xl font-bold text-[#193b2a]">
            {dish.price.toLocaleString("en-US")} ETB
          </p>

          <p
            className={`mt-4 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
              dish.isAvailable
                ? "bg-[#edf2e9] text-[#193b2a]"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {dish.isAvailable ? "Available to order" : "Currently unavailable"}
          </p>

          {dish.ingredients?.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-[#193b2a]">Ingredients</h2>

              <ul className="mt-3 flex flex-wrap gap-2">
                {dish.ingredients.map((ingredient) => (
                  <li
                    key={ingredient}
                    className="rounded-full border border-[#e9e7dc] bg-[#fffdf8] px-3 py-2 text-sm text-gray-700"
                  >
                    {ingredient}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <Link
            href="/menu"
            className="mt-8 inline-flex rounded-lg bg-[#193b2a] px-5 py-3 font-semibold text-white transition hover:bg-[#244b36]"
          >
            Explore more dishes
          </Link>
        </div>
      </div>
      <DishJsonLd dish={dish} />
    </main>
  );
}

// app/menu/[slug]/page.js

import { getDishBySlug } from "@/app/lib/dishes";
export default async function generateMetadata({ params }) {
  const { slug } = await params;
  const dish = await getDishBySlug(slug);
  if (!dish) return {};

  return {
    title: dish.name,
    description: dish.description,
    openGraph: {
      title: dish.name,
      description: dish.description,
      images: [
        {
          url: `/${dish.image}`,
          width: 1200,
          height: 630,
          alt: dish.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dish.name,
      description: dish.description,
      images: [`/${dish.image}`],
    },
  };
}

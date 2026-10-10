// app/sitemap.js
import { getMenu } from "./lib/dishes";

const BASE_URL = "https://adis-eats-next.vercel.app/";

export default async function sitemap() {
  const dishes = await getMenu();

  const staticRoutes = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/menu`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const dishRoutes = dishes.map((dish) => ({
    url: `${BASE_URL}/menu/${dish.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...dishRoutes];
}

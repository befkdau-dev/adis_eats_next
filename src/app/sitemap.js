import { getMenu } from "@/app/lib/menu";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap() {
  const result = await getMenu();
  const dishes = Array.isArray(result) ? result : (result.menu ?? []);

  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/menu`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...dishes.map((dish) => ({
      url: `${siteUrl}/menu/${dish.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}

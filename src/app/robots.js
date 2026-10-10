// app/robots.js
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://adis-eats-next.vercel.app/";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/checkout", "/orders", "/api", "/kitchen", "/login"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

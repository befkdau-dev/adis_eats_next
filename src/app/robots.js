// app/robots.js
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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

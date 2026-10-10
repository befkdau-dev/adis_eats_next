import Link from "next/link";
import { getMenu } from "./lib/dishes";
import AddToCartButton from "./menu/AddToCartButton";

const categories = [
  { name: "Main Course", blurb: "Kitfo, Doro Wat, Tibs and more" },
  { name: "Vegetarian", blurb: "Shiro, Misir Wat, Beyaynetu" },
  { name: "Breakfast", blurb: "Firfir and Chechebsa to start the day" },
];

const steps = [
  { title: "Pick your dishes", text: "Browse the menu and add what you like." },
  {
    title: "Check out",
    text: "Log in, enter your delivery details and place the order.",
  },
  { title: "Enjoy", text: "Track everything in your order history." },
];

export default async function Home() {
  const dishes = await getMenu();
  const featured = dishes.filter((d) => d.isAvailable).slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="rounded-2xl bg-orange-50 border border-orange-100 px-6 py-14 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-orange-600 mb-3">
          Authentic Ethiopian cuisine
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Welcome to <span className="text-orange-600">Adis Eats</span>
        </h1>
        <p className="max-w-xl mx-auto text-gray-600 mb-8">
          Traditional stews, spiced meats and fresh injera, made the way it
          should be and delivered to your door.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/menu"
            className="bg-orange-600 text-white px-6 py-2.5 rounded hover:bg-orange-700 transition"
          >
            Browse the menu
          </Link>
          <Link
            href="/cart"
            className="border border-gray-300 bg-white px-6 py-2.5 rounded hover:bg-gray-50 transition"
          >
            View your cart
          </Link>
        </div>
      </section>

      {/* Categories */}
      {/* <section>
        <h2 className="text-2xl font-bold mb-4">Explore by category</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.name}
              href={`/menu?category=${encodeURIComponent(c.name)}`}
              className="rounded-lg border border-gray-200 bg-white p-5 hover:shadow-md hover:border-orange-300 transition"
            >
              <h3 className="font-semibold text-lg mb-1">{c.name}</h3>
              <p className="text-sm text-gray-600">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section> */}

      {/* Featured dishes */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-2xl font-bold">Popular dishes</h2>
          <Link
            href="/menu"
            className="text-sm text-orange-600 hover:underline"
          >
            See full menu →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((dish) => (
            <div
              key={dish.id}
              className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md hover:border-orange-300 transition"
            >
              <h3 className="font-semibold text-lg">{dish.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {dish.description}
              </p>
              <p className="mt-2 text-orange-600 font-medium">
                {dish.price} birr
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Link
                  href={`/menu/${dish.id}`}
                  className="flex-1 text-center text-sm border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50 transition"
                >
                  View details
                </Link>
                <AddToCartButton dish={dish} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      {/* <section>
        <h2 className="text-2xl font-bold mb-4">How it works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="rounded-lg border border-gray-200 bg-white p-5"
            >
              <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold mb-3">
                {i + 1}
              </div>
              <h3 className="font-semibold mb-1">{s.title}</h3>
              <p className="text-sm text-gray-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* Closing CTA */}
      {/* <section className="rounded-2xl bg-orange-600 text-white px-6 py-10 text-center">
        <h2 className="text-2xl font-bold mb-2">Hungry yet?</h2>
        <p className="mb-5 text-orange-50">
          Your next favorite dish is a click away.
        </p>
        <Link
          href="/menu"
          className="inline-block bg-white text-orange-600 font-medium px-6 py-2.5 rounded hover:bg-orange-50 transition"
        >
          Order now
        </Link>
      </section> */}
    </div>
  );
}

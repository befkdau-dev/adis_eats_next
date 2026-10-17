import Link from "next/link";
import Image from "next/image";
import { getAvailableMenu } from "@/app/lib/menu";

export const metadata = {
  title: "Ethiopian Food, Delivered",
  description:
    "Explore Ethiopian dishes and discover your next favorite meal with Adis Eats.",
};
export default function HomePage() {
  const dishes = getAvailableMenu().slice(0, 3);

  return (
    <div className="-mx-6 -mt-6 bg-[#fffdf8] px-5 py-12 text-[#203b2d] sm:px-8 lg:px-12">
      <section className="mx-auto grid max-w-7xl items-center gap-10 py-8 lg:grid-cols-2">
        <div>
          <p className="font-semibold uppercase tracking-widest text-[#bd7137]">
            A taste of Ethiopia
          </p>

          <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-6xl">
            Your next favorite meal is{" "}
            <span className="text-[#bd7137]">closer than you think.</span>
          </h1>

          <p className="mt-5 max-w-xl leading-8 text-gray-600">
            Discover authentic Ethiopian flavors, from traditional stews to
            comforting vegetarian dishes.
          </p>

          <Link
            href="/menu"
            className="mt-7 inline-flex rounded-full bg-[#244b36] px-7 py-4 font-semibold text-white transition hover:bg-[#183b29]"
          >
            Explore our menu →
          </Link>
        </div>

        <div className="overflow-hidden rounded-[2rem] bg-[#e9e0cf]">
          <img
            src="/images/doro-wat.jpg"
            alt="Ethiopian Doro Wat"
            className="h-[320px] w-full object-cover sm:h-[440px]"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-semibold uppercase tracking-widest text-[#bd7137]">
              From our menu
            </p>
            <h2 className="mt-2 text-3xl font-bold">Customer favorites</h2>
          </div>

          <Link href="/menu" className="font-semibold text-[#244b36]">
            View all dishes →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish) => (
            <article
              key={dish.id}
              className="overflow-hidden rounded-3xl border border-[#e9e7dc] bg-white transition hover:-translate-y-1 hover:shadow-xl"
            >
              <Link href={`/menu/${dish.slug}`}>
                <Image
                  src={`/${dish.image}`}
                  alt={dish.imageAlt || dish.name}
                  width={800}
                  height={600}
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  priority
                  className="h-52 w-full object-cover"
                />
              </Link>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold">{dish.name}</h3>
                  <p className="shrink-0 font-bold text-[#bd7137]">
                    {dish.price} ETB
                  </p>
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {dish.description}
                </p>

                <Link
                  href={`/menu/${dish.id}`}
                  className="mt-5 inline-block font-semibold text-[#244b36] hover:text-[#bd7137]"
                >
                  View dish →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

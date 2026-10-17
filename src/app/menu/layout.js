import Link from "next/link";

const categories = [
  { name: "All Dishes", href: "/menu#all-dishes" },
  { name: "Main Course", href: "/menu#main-course" },
  { name: "Vegetarian", href: "/menu#vegetarian" },
  { name: "Breakfast", href: "/menu#breakfast" },
];

export default function MenuLayout({ children }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
        <aside className="hidden md:block">
          <h2 className="mb-4 text-lg font-bold">Categories</h2>

          <nav className="flex flex-col gap-2">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="rounded-lg px-3 py-2 text-sm text-[#203b2d] hover:bg-[#edf2e9]"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}

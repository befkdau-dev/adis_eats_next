import Link from "next/link";

export const metadata = {
  title: "Admin Panel | Adis Eats",
  description: "Manage the Adis Eats menu, orders, and dashboard.",
};

const adminSections = [
  {
    title: "Dashboard",
    description: "Review revenue, order counts, and business activity.",
    href: "/dashboard",
    icon: "📊",
  },
  {
    title: "Menu Management",
    description: "Add dishes, update prices, and control availability.",
    href: "/admin/menu",
    icon: "🍲",
  },
  {
    title: "Order Management",
    description: "Review customer orders and track their progress.",
    href: "/admin/orders",
    icon: "📋",
  },
];

export default function AdminHomePage() {
  return (
    <main className="mx-auto max-w-6xl space-y-8">
      <header>
        <h1 className="mt-2 text-3xl font-extrabold text-[#203b2d]">
          Admin Panel
        </h1>

        <p className="mt-2 text-[#526357]">
          Manage your restaurant from one place.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group rounded-2xl border border-[#e9e7dc] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#bd7137] hover:shadow-md"
          >
            <span className="text-3xl" aria-hidden="true">
              {section.icon}
            </span>

            <h2 className="mt-4 text-xl font-bold text-[#244b36] group-hover:text-[#bd7137]">
              {section.title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#526357]">
              {section.description}
            </p>

            <span className="mt-5 inline-block text-sm font-bold text-[#244b36]">
              Open section →
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}

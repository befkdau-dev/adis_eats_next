"use client";

const categories = [
  { label: "All Dishes", id: "all-dishes" },
  { label: "Main Course", id: "main-course" },
  { label: "Vegetarian", id: "vegetarian" },
  { label: "Breakfast", id: "breakfast" },
];

export default function CategoryBar() {
  return (
    <nav
      aria-label="Menu categories"
      className="mb-6 flex gap-2 overflow-x-auto pb-2 md:hidden"
    >
      {categories.map((category, index) => (
        <a
          key={category.id}
          href={`#${category.id}`}
          className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-bold transition-colors ${
            index === 0
              ? "bg-[#193b2a] text-white"
              : "border border-[#e9e7dc] bg-white text-[#244b36] hover:bg-[#edf2e9]"
          }`}
        >
          {category.label}
        </a>
      ))}
    </nav>
  );
}

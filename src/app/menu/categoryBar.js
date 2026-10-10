"use client";
import { useState } from "react";

const categories = ["All", "Main Course", "Vegterian", "Breakfast"];
export default function CategoryBar({ onSelect }) {
  const [selectedCategory, setselectedCategory] = useState("All");
  const handleClick = (category) => {
    setselectedCategory(category);
    onSelect?.(category);
  };

  return (
    <nav className="flex flex-col gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleClick(category)}
          className={
            selectedCategory === category
              ? "text-left px-3 py-2 rounded bg-orange-600 text-white font-medium"
              : "text-left px-3 py-2 rounded text-gray-700 hover:bg-gray-100"
          }
        >
          {category}
        </button>
      ))}
    </nav>
  );
}

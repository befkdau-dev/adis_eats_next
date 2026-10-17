"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartProvider";

export default function AddToCartButton({ dish }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!dish.isAvailable) return;

    addToCart(dish);
    setAdded(true);

    // Return the label to its normal state.
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={!dish.isAvailable}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#193b2a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#244b36] disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {added ? "Added to cart ✓" : "Add to cart"}
    </button>
  );
}

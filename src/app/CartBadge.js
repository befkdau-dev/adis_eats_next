// app/CartBadge.js
"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

export default function CartBadge() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      className="relative text-gray-700 hover:text-orange-600 transition-colors"
    >
      Cart
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-3 bg-orange-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );
}

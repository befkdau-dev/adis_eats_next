"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartProvider";

export default function CartNavLink() {
  const { totalItems, isLoaded } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={
        isLoaded
          ? `View shopping cart, ${totalItems} items`
          : "View shopping cart"
      }
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#dce5d9] bg-white px-3 py-2 font-bold text-[#244b36] transition-colors hover:border-[#244b36] hover:bg-[#f0f5ed] sm:px-4"
    >
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>

      <span>Cart</span>

      {isLoaded && totalItems > 0 && (
        <span
          aria-label={`${totalItems} items`}
          className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#bd7137] px-1.5 py-0.5 text-xs font-bold text-white"
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}

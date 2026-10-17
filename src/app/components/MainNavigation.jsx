"use client";

import { useState } from "react";
import Link from "next/link";
import CartNavLink from "./CartNavLink";

export default function MainNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass =
    "inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-bold text-[#244b36] transition-colors hover:bg-[#e9f0e6] hover:text-[#bd7137]";

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Desktop navigation */}
      <nav
        aria-label="Main navigation"
        className="hidden items-center gap-3 text-sm font-semibold md:flex lg:gap-6"
      >
        <Link
          href="/menu"
          className="inline-flex min-h-10 items-center rounded-lg bg-[#e9f0e6] px-4 text-sm font-bold text-[#244b36] transition-colors hover:bg-[#dce8d7] hover:text-[#bd7137]"
        >
          Menu
        </Link>

        <CartNavLink />

        <Link href="/checkout" className={linkClass}>
          Checkout
        </Link>

        <Link href="/orders" className={linkClass}>
          My Orders
        </Link>

        <Link href="/admin" className={linkClass}>
          Admin Orders
        </Link>
      </nav>

      {/* Mobile navigation */}
      <div className="relative md:hidden">
        <button
          type="button"
          onClick={() => setIsOpen((previous) => !previous)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          className="inline-flex size-11 items-center justify-center rounded-xl border border-[#e9e7dc] text-[#244b36] transition-colors hover:bg-[#e9f0e6]"
        >
          {isOpen ? (
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          )}
        </button>

        {isOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="absolute right-0 top-14 z-50 flex w-56 flex-col gap-2 rounded-2xl border border-[#e9e7dc] bg-[#fffdf8] p-3 shadow-xl"
          >
            <Link href="/menu" onClick={closeMenu} className={linkClass}>
              Menu
            </Link>

            <div className="px-1 py-1">
              <CartNavLink />
            </div>

            <Link href="/checkout" onClick={closeMenu} className={linkClass}>
              Checkout
            </Link>

            <Link href="/orders" onClick={closeMenu} className={linkClass}>
              My Orders
            </Link>

            <Link href="/admin" onClick={closeMenu} className={linkClass}>
              Admin Orders
            </Link>
          </nav>
        )}
      </div>
    </>
  );
}

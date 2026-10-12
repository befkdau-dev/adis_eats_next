// app/components/NavLinks.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/lib/auth-actions";
import CartBadge from "@/app/CartBadge";
import { useAuth } from "@/app/context/AuthContext";

const customerLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/checkout", label: "Checkout" },
  { href: "/orders", label: "Orders" },
];

const staffLinks = [{ href: "/dashboard", label: "Admin" }];

export default function NavLinks() {
  const pathname = usePathname();
  const { user, setUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isStaff = user?.role === "staff";
  const links = isStaff ? staffLinks : customerLinks;

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setIsOpen(false);
  };

  const linkClass = (href) =>
    pathname === href
      ? "text-orange-600 font-semibold"
      : "text-gray-700 hover:text-orange-600 transition-colors";

  return (
    <>
      {/* Desktop nav */}
      <div className="hidden sm:flex gap-6 text-sm font-medium items-center">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={linkClass(link.href)}
          >
            {link.label}
          </Link>
        ))}

        {!isStaff && <CartBadge />}

        {user ? (
          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-orange-600"
          >
            Log out ({user.name})
          </button>
        ) : (
          <Link href="/login" className="text-gray-700 hover:text-orange-600">
            Log in
          </Link>
        )}
      </div>

      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        className="sm:hidden p-2 text-gray-700 hover:text-orange-600"
      >
        {isOpen ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {/* Mobile dropdown panel */}
      {isOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-md z-50">
          <div className="flex flex-col px-4 py-3 gap-3 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={linkClass(link.href)}
              >
                {link.label}
              </Link>
            ))}

            {!isStaff && (
              <div onClick={() => setIsOpen(false)}>
                <CartBadge />
              </div>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="text-left text-gray-700 hover:text-orange-600"
              >
                Log out ({user.name})
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-orange-600"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}

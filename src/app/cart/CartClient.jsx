"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartProvider";

export default function CartClient() {
  const {
    cart,
    isLoaded,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalPrice,
  } = useCart();

  if (!isLoaded) {
    return <p className="py-12 text-center">Loading your cart...</p>;
  }

  if (cart.length === 0) {
    return (
      <section className="rounded-2xl border border-[#e9e7dc] bg-white p-8 text-center sm:p-12">
        <div className="text-5xl" aria-hidden="true">
          🛒
        </div>
        <h2 className="mt-4 text-2xl font-bold text-[#193b2a]">
          Your cart is empty
        </h2>
        <p className="mt-2 text-gray-600">
          Discover your favorite Ethiopian dishes.
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-flex rounded-lg bg-[#193b2a] px-5 py-3 font-semibold text-white hover:bg-[#244b36]"
        >
          Explore the menu
        </Link>
      </section>
    );
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
      <section className="space-y-4">
        {cart.map((item) => (
          <article
            key={item.id}
            className="flex gap-4 rounded-xl border border-[#e9e7dc] bg-white p-4"
          >
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#edf2e9] sm:h-28 sm:w-28">
              {item.image && (
                <Image
                  src={`/${item.image.replace(/^\/+/, "")}`}
                  alt={item.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-[#193b2a]">{item.name}</h2>
              <p className="mt-1 text-sm text-gray-600">
                {item.price.toLocaleString("en-US")} ETB each
              </p>
              <p className="mt-2 font-semibold">
                {(item.price * item.quantity).toLocaleString("en-US")} ETB
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-lg border border-[#e9e7dc]">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item.id)}
                    aria-label={`Decrease ${item.name} quantity`}
                    className="px-3 py-1.5"
                  >
                    −
                  </button>
                  <span className="min-w-8 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => increaseQuantity(item.id)}
                    disabled={item.quantity >= 50}
                    aria-label={`Increase ${item.name} quantity`}
                    className="px-3 py-1.5 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <aside className="rounded-xl border border-[#e9e7dc] bg-white p-5 lg:sticky lg:top-6">
        <h2 className="text-xl font-bold text-[#193b2a]">Order summary</h2>

        <div className="mt-5 flex justify-between gap-3 text-gray-600">
          <span>Subtotal</span>
          <span>{totalPrice.toLocaleString("en-US")} ETB</span>
        </div>

        <div className="mt-3 flex justify-between gap-3 text-gray-600">
          <span>Delivery</span>
          <span>Free</span>
        </div>

        <div className="mt-4 flex justify-between gap-3 border-t border-[#e9e7dc] pt-4 text-lg font-bold">
          <span>Total</span>
          <span className="text-[#193b2a]">
            {totalPrice.toLocaleString("en-US")} ETB
          </span>
        </div>

        <Link
          href="/checkout"
          className="mt-6 flex w-full justify-center rounded-lg bg-[#193b2a] px-5 py-3 font-semibold text-white hover:bg-[#244b36]"
        >
          Proceed to checkout
        </Link>

        <Link
          href="/menu"
          className="mt-3 block text-center text-sm font-medium text-[#bd7137] hover:underline"
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}

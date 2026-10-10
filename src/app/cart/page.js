// app/cart/page.js
"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

export default function CartPage() {
  const { items, addItem, removeItem, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-gray-600 mb-4">Add some dishes to get started.</p>
        <Link
          href="/menu"
          className="text-orange-600 font-medium hover:underline"
        >
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border border-gray-200 rounded-lg p-4"
          >
            <div>
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-600">{item.price} birr each</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => removeItem(item.id)}
                className="w-7 h-7 rounded bg-black-100 hover:bg-gray-200 hover:text-black text-sm"
              >
                −
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => addItem(item)}
                className="w-7 h-7 rounded bg-black-100 hover:bg-gray-200 hover:text-black text-sm"
              >
                +
              </button>

              <span className="w-16 text-right font-medium">
                {item.price * item.quantity} birr
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t pt-4">
        <button
          onClick={clearCart}
          className="text-sm text-gray-500 hover:underline"
        >
          Clear cart
        </button>
        <div className="text-right">
          <p className="text-lg font-bold">Total: {totalPrice} birr</p>
          <Link
            href="/checkout"
            className="inline-block mt-2 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            Proceed to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { placeOrder } from "@/app/actions";
import { useCart } from "@/app/context/CartProvider";

const initialState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export default function CheckoutForm() {
  const [state, formAction, pending] = useActionState(placeOrder, initialState);

  const { cart, isLoaded, clearCart, totalPrice } = useCart();

  const router = useRouter();
  const savedOrderId = useRef(null);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    if (!state.success || !state.order) return;

    const order = state.order;

    if (savedOrderId.current === order.id) return;
    savedOrderId.current = order.id;
    setStorageError("");

    try {
      let ownerId = localStorage.getItem("adis-eats-owner");

      if (!ownerId) {
        ownerId = crypto.randomUUID();
        localStorage.setItem("adis-eats-owner", ownerId);
      }

      const existing = JSON.parse(localStorage.getItem("orders") || "[]");

      if (!Array.isArray(existing)) {
        throw new Error("Invalid saved orders.");
      }

      const orderToSave = { ...order, ownerId };

      localStorage.setItem(
        "orders",
        JSON.stringify([orderToSave, ...existing]),
      );

      clearCart();

      router.push(`/checkout/success?orderId=${encodeURIComponent(order.id)}`);
    } catch {
      savedOrderId.current = null;
      setStorageError(
        "We couldn't save your order in this browser. Please check your browser storage and try again.",
      );
    }
  }, [state, clearCart, router]);

  if (!isLoaded) {
    return <p className="py-8">Loading your cart...</p>;
  }

  if (cart.length === 0 && !state.success) {
    return (
      <div className="rounded-xl border border-[#e9e7dc] p-6">
        <p>Your cart is empty. Add dishes before checking out.</p>
        <button
          type="button"
          onClick={() => router.push("/menu")}
          className="mt-4 rounded-lg bg-[#193b2a] px-5 py-3 font-semibold text-white"
        >
          Browse menu
        </button>
      </div>
    );
  }

  const errors = state.fieldErrors || {};

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1 block font-medium">
          Full name
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={100}
          autoComplete="name"
          className="w-full rounded-lg border border-gray-300 px-4 py-3"
        />
        {errors.name?.map((error) => (
          <p key={error} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>
      <div>
        <label htmlFor="phone" className="mb-1 block font-medium">
          Phone number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="+251912345678"
          autoComplete="tel"
          className="w-full rounded-lg border border-gray-300 px-4 py-3"
        />
        {errors.phone?.map((error) => (
          <p key={error} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>
      <div>
        <label htmlFor="area" className="mb-1 block font-medium">
          Delivery area
        </label>
        <input
          id="area"
          name="area"
          required
          maxLength={100}
          placeholder="e.g. Bole"
          autoComplete="address-level2"
          className="w-full rounded-lg border border-gray-300 px-4 py-3"
        />
        {errors.area?.map((error) => (
          <p key={error} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>
      <div>
        <label htmlFor="notes" className="mb-1 block font-medium">
          Delivery notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          maxLength={500}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-4 py-3"
        />
        {errors.notes?.map((error) => (
          <p key={error} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(
          cart.map(({ id, quantity }) => ({ id, quantity })),
        )}
      />
      {errors.items?.map((error) => (
        <p key={error} className="text-sm text-red-600">
          {error}
        </p>
      ))}
      {state.message && !state.success && (
        <p role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      )}
      {storageError && (
        <p role="alert" className="text-sm text-red-600">
          {storageError}
        </p>
      )}

      <div className="rounded-xl bg-[#edf2e9] p-4 text-[#203b2d]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Subtotal</span>
          <span className="font-semibold">
            {totalPrice.toLocaleString("en-US")} ETB
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-medium">Delivery</span>
          <span className="font-semibold">Free</span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-[#d5dfd0] pt-3 font-bold">
          <span>Total</span>
          <span className="text-[#193b2a]">
            {totalPrice.toLocaleString("en-US")} ETB
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending || cart.length === 0}
        className="w-full rounded-lg bg-[#193b2a] px-5 py-3 font-semibold text-white hover:bg-[#244b36] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Placing order..." : "Place order"}
      </button>
    </form>
  );
}

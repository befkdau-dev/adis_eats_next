"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { useOrders } from "@/app/context/OrdersContext";
import { validateCustomer } from "@/app/lib/validateOrder";
import { placeOrder } from "@/app/lib/order-actions";
import Link from "next/link";

const inputClass =
  "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500";

export default function CheckoutForm() {
  const { items, totalPrice, clearCart, isLoaded: cartLoaded } = useCart();
  const { user, isLoaded: authLoaded } = useAuth();
  const { addOrderId } = useOrders();
  const router = useRouter();
  const orderPlaced = useRef(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">
          Please log in to continue to checkout.
        </p>
        <Link
          href="/login?next=/checkout"
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 inline-block"
        >
          Log in
        </Link>
      </div>
    );
  }

  // Key change: once an order has been placed, don't show "empty cart"
  // even though clearCart() makes items.length briefly become 0.
  if (items.length === 0 && !orderPlaced.current) {
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

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const { errors: clientErrors, values } = validateCustomer(form);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setSubmitting(true);
    try {
      const result = await placeOrder({
        customer: values,
        items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
      });

      if (result.errors) {
        setErrors(result.errors);
        setServerError(result.errors.items ?? "Please fix the errors above");
        return;
      }

      // Order succeeded: flip the ref FIRST, then navigate, then clear.
      orderPlaced.current = true;
      addOrderId(result.order.id);
      router.push(`/checkout/success?orderId=${result.order.id}`);
      clearCart();
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {[
          { name: "name", label: "Full name", type: "text" },
          { name: "phone", label: "Phone number", type: "tel" },
          { name: "address", label: "Delivery address", type: "text" },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-medium mb-1" htmlFor={f.name}>
              {f.label}
            </label>
            <input
              id={f.name}
              name={f.name}
              type={f.type}
              value={form[f.name]}
              onChange={handleChange}
              className={inputClass}
            />
            {errors[f.name] && (
              <p className="text-xs text-red-500 mt-1">{errors[f.name]}</p>
            )}
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="notes">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={form.notes}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.notes && (
            <p className="text-xs text-red-500 mt-1">{errors.notes}</p>
          )}
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50"
        >
          {submitting ? "Placing order..." : `Place order · ${totalPrice} birr`}
        </button>
      </form>

      <div className="border border-gray-200 rounded-lg p-4 h-fit">
        <h2 className="font-semibold mb-3">Order summary</h2>
        <ul className="space-y-1 text-sm">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{item.price * item.quantity} birr</span>
            </li>
          ))}
        </ul>
        <p className="font-bold mt-3 border-t pt-3">Total: {totalPrice} birr</p>
      </div>
    </div>
  );
}

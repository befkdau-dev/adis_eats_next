// app/checkout/success/OrderConfirmation.js
"use client";

import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/app/lib/fetcher";

export default function OrderConfirmation({ orderId }) {
  const { data, error, isLoading } = useSWR(
    orderId ? `/api/orders/${orderId}` : null,
    fetcher,
  );

  if (isLoading) return <p className="text-gray-500">Loading...</p>;

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Order not found</h1>
        <p className="text-gray-600 mb-4">We couldn't find that order.</p>
        <Link
          href="/menu"
          className="text-orange-600 font-medium hover:underline"
        >
          Back to menu
        </Link>
      </div>
    );
  }

  const order = data.order;

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-1">Order placed!</h1>
      <p className="text-gray-600 mb-4">Order number: {order.id}</p>

      <ul className="space-y-1 text-sm border-t border-b py-3">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{item.subtotal} birr</span>
          </li>
        ))}
      </ul>

      <p className="font-bold mt-3">Total: {order.total} birr</p>
      <p className="text-sm text-gray-500 mt-2">
        Delivering to {order.customer.address}
      </p>

      <Link
        href="/orders"
        className="inline-block mt-6 text-orange-600 hover:underline"
      >
        View all my orders
      </Link>
    </div>
  );
}

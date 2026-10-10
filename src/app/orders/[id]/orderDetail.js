// app/orders/[id]/OrderDetail.js
"use client";

import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/app/lib/fetcher";

export default function OrderDetail({ id, initialOrder }) {
  const { data, error } = useSWR(`/api/orders/${id}`, fetcher, {
    fallbackData: { order: initialOrder },
    refreshInterval: 5000,
  });

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Order not found</h1>
        <Link href="/orders" className="text-orange-600 hover:underline">
          Back to orders
        </Link>
      </div>
    );
  }

  const order = data.order;

  return (
    <div className="max-w-md mx-auto py-8">
      <Link href="/orders" className="text-sm text-orange-600 hover:underline">
        ← Back to orders
      </Link>

      <h1 className="text-2xl font-bold mt-2 mb-1">Order {order.id}</h1>
      <p className="text-gray-600 mb-4">
        Placed {new Date(order.createdAt).toLocaleString()}
      </p>

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

      <p className="mt-2">
        Status:{" "}
        <span className="text-orange-600 font-medium capitalize">
          {order.status.replace(/-/g, " ")}
        </span>
      </p>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLocalOrders } from "@/app/lib/client-orders";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    function loadOrders() {
      setOrders(getLocalOrders());
    }

    loadOrders();

    // Update if localStorage changes in another browser tab.
    window.addEventListener("storage", loadOrders);

    return () => {
      window.removeEventListener("storage", loadOrders);
    };
  }, []);

  return (
    <main className="mx-auto min-h-[60vh] max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wider text-[#bd7137]">
          Your Adis Eats account
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-[#244b36]">
          My Orders
        </h1>

        <p className="mt-2 text-gray-600">
          View your orders and check their current status.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-[#e9e7dc] bg-white px-6 py-12 text-center">
          <h2 className="text-xl font-bold text-[#244b36]">No orders yet</h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
            Once you place an order, it will appear here so you can review its
            details.
          </p>

          <Link
            href="/menu"
            className="mt-6 inline-flex rounded-lg bg-[#244b36] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#183a28]"
          >
            Explore the Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const total =
              Number(order.total) ||
              (order.items || []).reduce(
                (sum, item) =>
                  sum +
                  (Number(item.subtotal) ||
                    Number(item.price) * Number(item.quantity || 1)),
                0,
              );

            return (
              <article
                key={order.id}
                className="rounded-2xl border border-[#e9e7dc] bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order reference</p>

                    <h2 className="mt-1 break-all text-lg font-bold text-[#244b36]">
                      #{order.id}
                    </h2>

                    <p className="mt-2 text-sm text-gray-600">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "Order date unavailable"}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#edf2e9] px-3 py-1 text-sm font-semibold capitalize text-[#244b36]">
                    {order.status || "Pending"}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#e9e7dc] pt-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {(order.items || []).length} item type(s)
                    </p>

                    <p className="mt-1 text-lg font-extrabold text-[#244b36]">
                      {total.toLocaleString("en-US")} ETB
                    </p>
                  </div>

                  <Link
                    href={`/orders/${encodeURIComponent(String(order.id))}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#244b36] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#183a28]"
                  >
                    View Order
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

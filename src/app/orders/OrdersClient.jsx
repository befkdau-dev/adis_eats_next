"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrdersClient() {
  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const ownerId = localStorage.getItem("adis-eats-owner");
      const saved = JSON.parse(localStorage.getItem("orders") || "[]");

      setOrders(
        Array.isArray(saved)
          ? saved.filter((order) => order.ownerId === ownerId)
          : [],
      );
    } catch {
      setOrders([]);
      setMessage("Unable to read your saved orders.");
    } finally {
      setLoaded(true);
    }
  }, []);

  function cancelOrder(orderId) {
    try {
      const ownerId = localStorage.getItem("adis-eats-owner");
      const saved = JSON.parse(localStorage.getItem("orders") || "[]");

      if (!Array.isArray(saved) || !ownerId) {
        setMessage("Unable to verify this order.");
        return;
      }

      const order = saved.find((item) => item.id === orderId);

      if (!order || order.ownerId !== ownerId) {
        setMessage("You cannot cancel this order.");
        return;
      }

      if (order.status !== "pending") {
        setMessage("Only pending orders can be cancelled.");
        return;
      }

      const updated = saved.map((item) =>
        item.id === orderId ? { ...item, status: "cancelled" } : item,
      );

      localStorage.setItem("orders", JSON.stringify(updated));

      setOrders(updated.filter((item) => item.ownerId === ownerId));
      setMessage("Order cancelled.");
    } catch {
      setMessage("Unable to cancel this order.");
    }
  }

  if (!loaded) {
    return <p className="py-8">Loading your orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <section className="rounded-xl border border-[#e9e7dc] p-8 text-center">
        <h2 className="text-xl font-bold text-[#193b2a]">No orders yet</h2>
        <p className="mt-2 text-gray-600">
          Your placed orders will appear here in this browser.
        </p>
        <Link
          href="/menu"
          className="mt-5 inline-flex rounded-lg bg-[#193b2a] px-5 py-3 font-semibold text-white"
        >
          Explore menu
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      {message && (
        <p role="status" className="text-sm text-[#193b2a]">
          {message}
        </p>
      )}

      {orders.map((order) => (
        <article
          key={order.id}
          className="rounded-xl border border-[#e9e7dc] bg-white p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-bold text-[#193b2a]">
                Order #{order.id.slice(0, 8)}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "Date unavailable"}
              </p>
            </div>

            <span className="rounded-full bg-[#edf2e9] px-3 py-1 text-sm font-medium capitalize text-[#193b2a]">
              {order.status}
            </span>
          </div>

          <div className="mt-4 space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>
                  {(item.price * item.quantity).toLocaleString("en-US")} ETB
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#e9e7dc] pt-4">
            <span className="font-bold text-[#193b2a]">
              Total: {Number(order.total).toLocaleString("en-US")} ETB
            </span>

            {order.status === "pending" && (
              <button
                type="button"
                onClick={() => cancelOrder(order.id)}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Cancel order
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

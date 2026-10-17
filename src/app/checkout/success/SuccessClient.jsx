"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SuccessClient({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const ownerId = localStorage.getItem("adis-eats-owner");
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");

      const found = Array.isArray(orders)
        ? orders.find((item) => item.id === orderId && item.ownerId === ownerId)
        : null;

      setOrder(found || null);
    } catch {
      setOrder(null);
    } finally {
      setLoaded(true);
    }
  }, [orderId]);

  if (!loaded) {
    return <p className="py-12 text-center">Loading order...</p>;
  }

  if (!order) {
    return (
      <section className="rounded-2xl border border-[#e9e7dc] p-8 text-center">
        <h1 className="text-2xl font-bold text-[#193b2a]">Order not found</h1>
        <p className="mt-2 text-gray-600">
          This order could not be found in this browser.
        </p>
        <Link
          href="/orders"
          className="mt-5 inline-block font-semibold text-[#bd7137]"
        >
          View your orders
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[#e9e7dc] bg-white p-6 sm:p-10">
      <div className="text-5xl" aria-hidden="true">
        ✓
      </div>
      <h1 className="mt-4 text-3xl font-bold text-[#193b2a]">
        Your order has been placed!
      </h1>
      <p className="mt-3 text-gray-600">
        Your order has been saved in this browser.
      </p>

      <div className="mt-6 rounded-xl bg-[#edf2e9] p-4  text-[#203b2d]">
        <p>
          <span className="font-semibold">Order ID:</span> {order.id}
        </p>
        <p className="mt-2">
          <span className="font-semibold">Status:</span> {order.status}
        </p>
        <p className="mt-2">
          <span className="font-semibold">Delivery area:</span> {order.area}
        </p>
        <p className="mt-2">
          <span className="font-semibold">Total:</span>{" "}
          {Number(order.total).toLocaleString("en-US")} ETB
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/orders"
          className="rounded-lg bg-[#193b2a] px-5 py-3 font-semibold text-white"
        >
          View my orders
        </Link>
        <Link
          href="/menu"
          className="rounded-lg border border-[#e9e7dc] px-5 py-3 font-semibold text-[#193b2a]"
        >
          Continue shopping
        </Link>
      </div>
    </section>
  );
}

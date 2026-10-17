"use client";

import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { localOrderFetcher } from "@/app/lib/localOrderFetcher";
import DeliveryMapLoader from "@/app/track/[id]/DeliveryMapLoader";
import { etb, when, relative } from "@/app/lib/format";
import { downloadCsv, toCsv } from "@/app/lib/csv";

function normalizeStatus(status) {
  return String(status || "received")
    .toLowerCase()
    .trim()
    .replaceAll(" ", "-");
}

function getStatusLabel(status) {
  const labels = {
    received: "Order received",
    pending: "Pending",
    preparing: "Being prepared",
    "out-for-delivery": "Out for delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return labels[status] || status.replaceAll("-", " ");
}

export default function OrderDetailClient({ orderId }) {
  const {
    data: order,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(`local-order:${orderId}`, localOrderFetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
    shouldRetryOnError: false,
  });

  const [connection, setConnection] = useState("connecting");

  const refreshOrder = useCallback(() => {
    mutate();
  }, [mutate]);

  const status = normalizeStatus(order?.status);
  const isDelivered = status === "delivered";
  const isFinished = isDelivered || status === "cancelled";

  // Refresh immediately when this tab or another component changes an order.
  useEffect(() => {
    const handleOrderUpdate = () => refreshOrder();

    window.addEventListener("ordersUpdated", handleOrderUpdate);
    window.addEventListener("storage", handleOrderUpdate);

    return () => {
      window.removeEventListener("ordersUpdated", handleOrderUpdate);
      window.removeEventListener("storage", handleOrderUpdate);
    };
  }, [refreshOrder]);

  // The stream reports connection health. The actual order remains in localStorage.
  const hasOrder = Boolean(order);
  useEffect(() => {
    if (!hasOrder) return;

    if (isFinished) {
      setConnection("closed");
      return;
    }

    setConnection("connecting");

    const source = new EventSource(
      `/api/orders/${encodeURIComponent(orderId)}/stream`,
    );

    source.onopen = () => setConnection("connected");
    source.onerror = () => setConnection("reconnecting");

    source.addEventListener("connected", () => {
      setConnection("connected");
    });

    return () => {
      source.close();
    };
  }, [orderId, isFinished, hasOrder]);

  if (isLoading) {
    return <p className="p-8">Loading order details...</p>;
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-bold text-[#244b36]">Order not found</h1>
        <p className="mt-3 text-gray-600">
          This order could not be found in your browser&apos;s saved orders.
        </p>
        <Link
          href="/orders"
          className="mt-5 inline-flex rounded-lg bg-[#244b36] px-5 py-3 font-bold text-white"
        >
          Back to My Orders
        </Link>
      </main>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];

  const subtotal =
    Number(order.subtotal) ||
    items.reduce(
      (sum, item) =>
        sum +
        (Number(item.subtotal) ||
          Number(item.price || 0) * Number(item.quantity || 1)),
      0,
    );

  const total =
    Number(order.total) || subtotal + Number(order.deliveryFee || 0);

  const courierPosition =
    order.courierLocation || order.courierCoordinates || null;

  const deliveryPosition =
    order.deliveryLocation ||
    order.deliveryCoordinates ||
    order.destinationCoordinates ||
    null;

  const hasCourierCoordinates =
    courierPosition?.lat != null || courierPosition?.latitude != null;

  const hasDeliveryCoordinates =
    deliveryPosition?.lat != null || deliveryPosition?.latitude != null;

  const connectionLabels = {
    connecting: "Connecting to tracking stream…",
    connected: "Tracking stream connected",
    reconnecting: "Reconnecting to tracking stream…",
    closed: "Tracking stream closed",
  };

  function exportOrderCsv() {
    const rows = [
      {
        orderId: order.id,
        customer: order.name || "",
        phone: order.phone || "",
        area: order.area || "",
        status,
        orderDate: order.createdAt || "",
        items: items
          .map(
            (item) => `${item.name || "Item"} x${Number(item.quantity) || 1}`,
          )
          .join("; "),
        subtotal,
        deliveryFee: Number(order.deliveryFee || 0),
        total,
      },
    ];

    downloadCsv(`adis-eats-order-${order.id}.csv`, toCsv(rows));
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href="/orders"
        className="text-sm font-semibold text-[#244b36] underline"
      >
        ← Back to My Orders
      </Link>

      <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm text-gray-500">Order reference</p>
          <h1 className="mt-1 break-all text-2xl font-extrabold text-[#244b36]">
            #{order.id}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Placed {when(order.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[#edf2e9] px-3 py-2 text-sm font-bold capitalize text-[#244b36]">
            {getStatusLabel(status)}
          </span>

          <button
            type="button"
            onClick={exportOrderCsv}
            className="rounded-xl bg-[#244b36] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#193b29]"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Delivery tracking map */}
      <section className="mt-8 rounded-2xl border border-[#e9e7dc] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#244b36]">
              Track your delivery
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Follow the delivery details for this order.
            </p>
          </div>

          <span
            className="inline-flex items-center gap-2 rounded-full bg-[#edf2e9] px-3 py-2 text-xs font-semibold text-[#244b36]"
            aria-live="polite"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                connection === "connected"
                  ? "bg-green-600"
                  : connection === "reconnecting"
                    ? "bg-amber-500"
                    : "bg-gray-400"
              }`}
            />
            {connectionLabels[connection]}
          </span>
        </div>

        <DeliveryMapLoader
          order={order}
          courierPosition={courierPosition}
          deliveryPosition={deliveryPosition}
          isApproximate={!hasCourierCoordinates || !hasDeliveryCoordinates}
        />

        <p className="mt-3 text-xs text-gray-500" aria-live="polite">
          {isDelivered
            ? "This order is marked delivered. The tracking stream is closed."
            : status === "cancelled"
              ? "This order is cancelled. The tracking stream is closed."
              : "Order status is checked every five seconds."}
        </p>
      </section>

      {/* Customer and delivery information */}
      <section className="mt-6 rounded-2xl border border-[#e9e7dc] bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-lg font-bold text-[#244b36]">
          Customer and delivery details
        </h2>

        <div className="mt-4 grid gap-4 rounded-xl bg-[#edf2e9] p-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-600">Customer</p>
            <p className="font-semibold">{order.name || "Not provided"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Delivery area</p>
            <p className="font-semibold">{order.area || "Not provided"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-semibold">{order.phone || "Not provided"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Order date</p>
            <p className="font-semibold">{when(order.createdAt)}</p>
          </div>
        </div>

        {order.notes && (
          <div className="mt-5">
            <h3 className="font-bold text-[#244b36]">Order notes</h3>
            <p className="mt-1 text-sm text-gray-600">{order.notes}</p>
          </div>
        )}

        <h2 className="mt-8 text-lg font-bold text-[#244b36]">Items ordered</h2>

        <div className="mt-3 divide-y divide-[#e9e7dc]">
          {items.map((item, index) => {
            const quantity = Number(item.quantity) || 1;
            const price = Number(item.price) || 0;
            const itemSubtotal = Number(item.subtotal) || price * quantity;

            return (
              <div
                key={item.id ?? `${item.name}-${index}`}
                className="flex justify-between gap-4 py-4"
              >
                <div>
                  <p className="font-semibold text-[#244b36]">
                    {item.name || "Menu item"}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {quantity} × {etb(price)}
                  </p>
                </div>
                <p className="shrink-0 font-semibold text-[#244b36]">
                  {etb(itemSubtotal)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 space-y-2 border-t border-[#e9e7dc] pt-4 text-sm">
          <p className="flex justify-between gap-4">
            <span>Subtotal</span>
            <span>{etb(subtotal)}</span>
          </p>
          <p className="flex justify-between gap-4">
            <span>Delivery fee</span>
            <span>{etb(order.deliveryFee || 0)}</span>
          </p>
          <p className="flex justify-between gap-4 text-lg font-extrabold text-[#244b36]">
            <span>Total</span>
            <span>{etb(total)}</span>
          </p>
        </div>

        <p className="mt-6 border-t border-[#e9e7dc] pt-4 text-xs text-gray-500">
          {isValidating
            ? "Checking saved order…"
            : `Last order update: ${relative(order.updatedAt || order.createdAt)}`}
        </p>
      </section>
    </main>
  );
}

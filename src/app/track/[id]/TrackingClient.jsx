"use client";

import { useCallback, useEffect, useState } from "react";
import { getLocalOrder } from "@/app/lib/client-orders";
import { etb, when, relative } from "@/app/lib/format";
import { downloadCsv, toCsv } from "@/app/lib/csv";
import DeliveryMapLoader from "./DeliveryMapLoader";

const statusLabels = {
  received: "Order received",
  preparing: "Being prepared",
  "out-for-delivery": "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function getOrderStatus(order) {
  return String(order?.status || "received").toLowerCase();
}

function getOrderItems(order) {
  if (Array.isArray(order?.items)) return order.items;
  if (Array.isArray(order?.orderItems)) return order.orderItems;
  return [];
}

export default function TrackingClient({ id }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState("connecting");

  const refreshOrder = useCallback(() => {
    const found = getLocalOrder(id);
    setOrder(found);
    setLoading(false);
  }, [id]);

  const status = getOrderStatus(order);
  const isDelivered = status === "delivered";

  useEffect(() => {
    refreshOrder();

    const handleUpdate = () => refreshOrder();

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("ordersUpdated", handleUpdate);

    // Also catches localStorage updates that don't dispatch a custom event.
    const interval = window.setInterval(refreshOrder, 2000);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("ordersUpdated", handleUpdate);
    };
  }, [refreshOrder]);

  useEffect(() => {
    if (isDelivered) {
      setConnection("closed");
      return;
    }

    setConnection("connecting");

    const source = new EventSource(
      `/api/orders/${encodeURIComponent(id)}/stream`,
    );

    source.addEventListener("connected", () => {
      setConnection("connected");
    });

    source.onopen = () => setConnection("connected");
    source.onerror = () => setConnection("reconnecting");

    return () => {
      source.close();
    };
  }, [id, isDelivered]);

  function exportOrder() {
    if (!order) return;

    const items = getOrderItems(order);
    const row = {
      orderId: order.id,
      customer: order.customerName || order.name || order.customer?.name || "",
      phone: order.phone || order.customerPhone || order.customer?.phone || "",
      area: order.area || order.deliveryArea || "",
      status,
      createdAt: order.createdAt || order.placedAt || "",
      items: items
        .map(
          (item) =>
            `${item.name || item.title || "Item"} x${item.quantity || 1}`,
        )
        .join("; "),
      subtotal: order.subtotal ?? "",
      deliveryFee: order.deliveryFee ?? "",
      total: order.total ?? order.grandTotal ?? "",
    };

    downloadCsv(`adis-eats-order-${order.id}.csv`, toCsv([row]));
  }

  if (loading) {
    return <p className="p-6 text-[#203b2d]">Loading order details…</p>;
  }

  if (!order) {
    return (
      <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6">
        <h1 className="text-xl font-bold text-[#203b2d]">Order not found</h1>
        <p className="mt-2 text-sm text-gray-600">
          This order was not found in this browser's local storage. Make sure
          you're using the same browser and device where the order was placed.
        </p>
      </section>
    );
  }

  const items = getOrderItems(order);
  const deliveryPosition =
    order.deliveryLocation || order.deliveryCoordinates || null;
  const courierPosition =
    order.courierLocation || order.courierCoordinates || null;

  const hasCoordinates = Boolean(
    deliveryPosition?.lat != null || deliveryPosition?.latitude != null,
  );

  const connectionText = {
    connecting: "Connecting…",
    connected: "Stream connected",
    reconnecting: "Reconnecting…",
    closed: "Stream closed",
  }[connection];

  return (
    <div className="space-y-6 text-[#203b2d]">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Order #{order.id}</p>
          <h1 className="mt-1 text-2xl font-bold">Track your delivery</h1>
          <p className="mt-2 text-sm text-gray-600">
            {statusLabels[status] || status}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Last order check: {relative(order.updatedAt || order.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full bg-[#e9f0e6] px-3 py-2 text-xs font-medium"
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
            {connectionText}
          </span>

          <button
            type="button"
            onClick={exportOrder}
            className="rounded-xl bg-[#244b36] px-4 py-2 text-sm font-semibold text-white hover:bg-[#193b29]"
          >
            Export order CSV
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
        <h2 className="text-lg font-semibold">Delivery status</h2>
        <p className="mt-2">
          Current status: <strong>{statusLabels[status] || status}</strong>
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Order placed: {when(order.createdAt || order.placedAt)}
        </p>
        {isDelivered && (
          <p className="mt-3 text-sm font-medium text-green-700">
            Your order is marked as delivered. Live connection closed.
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Courier and destination</h2>
        <DeliveryMapLoader
          order={order}
          courierPosition={courierPosition}
          deliveryPosition={deliveryPosition}
          isApproximate={!hasCoordinates || !courierPosition}
        />
      </section>

      <section className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
        <h2 className="text-lg font-semibold">Order summary</h2>

        {items.length > 0 ? (
          <ul className="mt-3 divide-y divide-gray-100">
            {items.map((item, index) => (
              <li
                key={item.id ?? item.dishId ?? `${item.name}-${index}`}
                className="flex justify-between gap-4 py-3 text-sm"
              >
                <span>
                  {item.name || item.title || "Menu item"} ×{" "}
                  {item.quantity || 1}
                </span>
                <span className="font-medium">
                  {etb(Number(item.price || 0) * Number(item.quantity || 1))}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-gray-500">
            No item details are saved for this order.
          </p>
        )}

        <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
          <p className="flex justify-between gap-4">
            <span>Subtotal</span>
            <span>{etb(order.subtotal ?? 0)}</span>
          </p>
          <p className="flex justify-between gap-4">
            <span>Delivery fee</span>
            <span>{etb(order.deliveryFee ?? 0)}</span>
          </p>
          <p className="flex justify-between gap-4 font-bold">
            <span>Total</span>
            <span>{etb(order.total ?? order.grandTotal ?? 0)}</span>
          </p>
        </div>
      </section>
    </div>
  );
}

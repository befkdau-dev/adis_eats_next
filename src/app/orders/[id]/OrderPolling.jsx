"use client";

import useSWR from "swr";

function getLocalOrder(id) {
  const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");

  return savedOrders.find((order) => String(order.id) === String(id));
}

export default function OrderPolling({ initialOrder }) {
  const { data: order } = useSWR(
    `local-order-${initialOrder.id}`,
    () => getLocalOrder(initialOrder.id) || initialOrder,
    {
      fallbackData: initialOrder,
      refreshInterval: 5000,
    },
  );

  return (
    <section>
      <h1>Order {order.id}</h1>
      <p>Status: {order.status}</p>
    </section>
  );
}

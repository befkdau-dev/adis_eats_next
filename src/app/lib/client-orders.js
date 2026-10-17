"use client";

const STORAGE_KEYS = ["orders", "order"];

export function getLocalOrders() {
  if (typeof window === "undefined") {
    return [];
  }

  const allOrders = [];

  for (const key of STORAGE_KEYS) {
    try {
      const savedData = localStorage.getItem(key);

      if (!savedData) continue;

      const parsed = JSON.parse(savedData);

      if (Array.isArray(parsed)) {
        allOrders.push(...parsed);
      } else if (Array.isArray(parsed?.orders)) {
        allOrders.push(...parsed.orders);
      } else if (parsed && typeof parsed === "object") {
        allOrders.push(parsed);
      }
    } catch (error) {
      console.error(`Unable to read "${key}" from localStorage:`, error);
    }
  }

  // Avoid duplicate orders if the same order exists under both keys.
  const uniqueOrders = new Map();

  for (const order of allOrders) {
    if (order?.id != null) {
      uniqueOrders.set(String(order.id), order);
    }
  }

  return Array.from(uniqueOrders.values()).reverse();
}

export function getLocalOrder(id) {
  return (
    getLocalOrders().find((order) => String(order.id) === String(id)) ?? null
  );
}

export function saveLocalOrders(orders) {
  if (typeof window === "undefined") {
    throw new Error("Order storage is only available in the browser.");
  }

  if (!Array.isArray(orders)) {
    throw new Error("Orders must be an array.");
  }

  // Migrate the legacy "order" key into the canonical "orders" key.
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.removeItem("order");

  window.dispatchEvent(new Event("ordersUpdated"));
}

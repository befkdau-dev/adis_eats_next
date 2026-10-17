"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getLocalOrders, saveLocalOrders } from "@/app/lib/client-orders";

const STATUSES = [
  "received",
  "preparing",
  "out-for-delivery",
  "delivered",
  "cancelled",
];

const STATUS_LABELS = {
  received: "Received",
  preparing: "Preparing",
  "out-for-delivery": "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusStyles = {
  received: "bg-blue-100 text-blue-800",
  preparing: "bg-amber-100 text-amber-800",
  "out-for-delivery": "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const inputClass =
  "rounded-lg border border-[#d8dfd5] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#244b36]";

function money(value) {
  return `${Number(value || 0).toLocaleString("en-ET", {
    maximumFractionDigits: 2,
  })} ETB`;
}

function getStatus(order) {
  const status = String(order.status || "received").toLowerCase();
  return STATUSES.includes(status) ? status : "received";
}

function getCustomer(order) {
  return order.customerName || order.customer?.name || order.name || "Customer";
}

function getPhone(order) {
  return order.phone || order.customerPhone || order.customer?.phone || "—";
}

function getItems(order) {
  return Array.isArray(order.items) ? order.items : [];
}

function getTotal(order) {
  if (Number.isFinite(Number(order.total))) return Number(order.total);

  return getItems(order).reduce((sum, item) => {
    const price = Number(item.price || item.unitPrice || 0);
    const quantity = Number(item.quantity || item.qty || 1);
    return sum + price * quantity;
  }, 0);
}

function getCreatedAt(order) {
  const value = order.createdAt || order.created_at || order.date;
  if (!value) return "Date unavailable";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
}

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [actionError, setActionError] = useState("");

  const refreshOrders = useCallback(() => {
    try {
      setOrders(getLocalOrders());
      setLoadError("");
    } catch {
      setLoadError("Could not read orders from browser storage.");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    refreshOrders();

    function handleStorageChange() {
      refreshOrders();
    }

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("ordersUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("ordersUpdated", handleStorageChange);
    };
  }, [refreshOrders]);

  const summary = useMemo(() => {
    const activeOrders = orders.filter(
      (order) => !["cancelled", "delivered"].includes(getStatus(order)),
    );

    const completedOrders = orders.filter(
      (order) => getStatus(order) === "delivered",
    );

    const revenue = orders
      .filter((order) => getStatus(order) !== "cancelled")
      .reduce((sum, order) => sum + getTotal(order), 0);

    return {
      total: orders.length,
      active: activeOrders.length,
      completed: completedOrders.length,
      revenue,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    const result = orders.filter((order) => {
      const matchesSearch =
        !term ||
        String(order.id ?? "")
          .toLowerCase()
          .includes(term) ||
        getCustomer(order).toLowerCase().includes(term) ||
        getPhone(order).toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" || getStatus(order) === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return result.sort((a, b) => {
      if (sort === "oldest") {
        return (
          new Date(a.createdAt || a.created_at || 0) -
          new Date(b.createdAt || b.created_at || 0)
        );
      }

      if (sort === "amount-low") return getTotal(a) - getTotal(b);
      if (sort === "amount-high") return getTotal(b) - getTotal(a);

      return (
        new Date(b.createdAt || b.created_at || 0) -
        new Date(a.createdAt || a.created_at || 0)
      );
    });
  }, [orders, search, statusFilter, sort]);

  const selectedOrder = orders.find(
    (order) => String(order.id) === String(selectedOrderId),
  );

  function updateStatus(order, nextStatus) {
    if (!STATUSES.includes(nextStatus)) return;

    if (
      nextStatus === "cancelled" &&
      !window.confirm(`Cancel order #${order.id}?`)
    ) {
      return;
    }

    const updatedOrders = orders.map((item) =>
      String(item.id) === String(order.id)
        ? { ...item, status: nextStatus, updatedAt: new Date().toISOString() }
        : item,
    );

    try {
      saveLocalOrders(updatedOrders);
      setOrders(updatedOrders);
      setActionError("");
    } catch {
      setActionError("Could not save the status. Check browser storage.");
    }
  }

  if (!loaded) {
    return <main className="p-6 text-[#203b2d]">Loading orders...</main>;
  }

  return (
    <main className="mx-auto max-w-7xl space-y-7">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wider text-[#bd7137]">
          Adis Eats Admin
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#203b2d]">
          Order Management
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Review orders, inspect customer details, and track fulfilment.
        </p>
      </header>

      {loadError && (
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
          {loadError}
        </p>
      )}

      {actionError && (
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
          {actionError}
        </p>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "All orders", value: summary.total },
          { label: "In progress", value: summary.active },
          { label: "Delivered", value: summary.completed },
          {
            label: "Order value (excl. cancelled)",
            value: money(summary.revenue),
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-[#e3e8df] bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-600">{item.label}</p>
            <p className="mt-3 break-words text-2xl font-bold text-[#203b2d]">
              {item.value}
            </p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <input
            className={`${inputClass} min-w-0 flex-1`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search order ID, customer, or phone..."
            aria-label="Search orders"
          />

          <select
            className={inputClass}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>

          <select
            className={inputClass}
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort orders"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="amount-high">Highest amount</option>
            <option value="amount-low">Lowest amount</option>
          </select>

          <button
            type="button"
            onClick={refreshOrders}
            className="rounded-lg border border-[#244b36] px-4 py-2.5 text-sm font-semibold text-[#244b36] hover:bg-[#e9f0e6]"
          >
            Refresh
          </button>
        </div>

        <p className="text-sm text-gray-600">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>

        {filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <h2 className="font-semibold text-[#203b2d]">
              {orders.length === 0 ? "No orders yet" : "No matching orders"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {orders.length === 0
                ? "Orders placed in this browser will appear here."
                : "Try another search term or status filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#e3e8df] bg-white">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-[#e9f0e6] text-[#203b2d]">
                <tr>
                  <th className="p-4">Order</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => {
                  const status = getStatus(order);

                  return (
                    <tr
                      key={order.id}
                      className="border-t border-gray-100 align-top"
                    >
                      <td className="p-4 font-semibold text-[#203b2d]">
                        #{order.id}
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{getCustomer(order)}</p>
                        <p className="mt-1 text-gray-500">{getPhone(order)}</p>
                      </td>
                      <td className="p-4 text-gray-600">
                        {getCreatedAt(order)}
                      </td>
                      <td className="p-4 font-semibold">
                        {money(getTotal(order))}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
                        >
                          {STATUS_LABELS[status]}
                        </span>
                      </td>
                      <td className="space-y-2 p-4">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderId(order.id)}
                          className="block font-semibold text-[#244b36] underline"
                        >
                          View details
                        </button>

                        <select
                          className={`${inputClass} max-w-48`}
                          value={status}
                          onChange={(event) =>
                            updateStatus(order, event.target.value)
                          }
                          aria-label={`Update status for order ${order.id}`}
                        >
                          {STATUSES.map((item) => (
                            <option key={item} value={item}>
                              {STATUS_LABELS[item]}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedOrderId(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-detail-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-[#fffdf8] p-5 sm:rounded-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#bd7137]">
                  Order details
                </p>
                <h2
                  id="order-detail-title"
                  className="mt-1 text-2xl font-bold text-[#203b2d]"
                >
                  Order #{selectedOrder.id}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderId(null)}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="mt-1 font-semibold">
                  {getCustomer(selectedOrder)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="mt-1 font-semibold">{getPhone(selectedOrder)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivery area</p>
                <p className="mt-1 font-semibold">
                  {selectedOrder.area ||
                    selectedOrder.deliveryArea ||
                    selectedOrder.address ||
                    "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Placed</p>
                <p className="mt-1 font-semibold">
                  {getCreatedAt(selectedOrder)}
                </p>
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="mt-4 rounded-lg bg-white p-3">
                <p className="text-sm text-gray-500">Customer notes</p>
                <p className="mt-1">{selectedOrder.notes}</p>
              </div>
            )}

            <h3 className="mt-7 font-bold text-[#203b2d]">Items</h3>

            <div className="mt-3 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
              {getItems(selectedOrder).length === 0 ? (
                <p className="p-4 text-sm text-gray-500">
                  No item details were saved with this order.
                </p>
              ) : (
                getItems(selectedOrder).map((item, index) => {
                  const quantity = Number(item.quantity || item.qty || 1);
                  const price = Number(item.price || item.unitPrice || 0);

                  return (
                    <div
                      key={`${item.id || item.name || "item"}-${index}`}
                      className="flex items-start justify-between gap-4 p-4"
                    >
                      <div>
                        <p className="font-medium">
                          {item.name || item.title || "Menu item"}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {quantity} × {money(price)}
                        </p>
                      </div>
                      <p className="whitespace-nowrap font-semibold">
                        {money(quantity * price)}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-5 space-y-2 border-t border-gray-200 pt-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Subtotal</span>
                <span>{money(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Delivery fee</span>
                <span>
                  {money(
                    selectedOrder.deliveryFee ?? selectedOrder.delivery_fee,
                  )}
                </span>
              </div>
              <div className="flex justify-between gap-4 text-lg font-bold text-[#203b2d]">
                <span>Total</span>
                <span>{money(getTotal(selectedOrder))}</span>
              </div>
            </div>

            <label className="mt-6 block space-y-2 text-sm font-semibold">
              Update order status
              <select
                className={`${inputClass} w-full`}
                value={getStatus(selectedOrder)}
                onChange={(event) =>
                  updateStatus(selectedOrder, event.target.value)
                }
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </label>
          </section>
        </div>
      )}
    </main>
  );
}

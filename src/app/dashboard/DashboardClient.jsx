"use client";

import { useCallback, useEffect, useState } from "react";
import RevenueChart from "./RevenueChart";
import {
  aggregateOrders,
  formatETB,
  parseStoredOrders,
} from "@/app/lib/order-utils";

function SummaryCard({ title, value, detail }) {
  return (
    <article className="rounded-2xl border border-[#e9e7dc] bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-2 break-words text-2xl font-bold text-[#203b2d]">
        {value}
      </p>
      <p className="mt-1 text-sm text-gray-500">{detail}</p>
    </article>
  );
}

function DashboardSkeleton() {
  return (
    <div aria-busy="true" className="space-y-6">
      <div className="h-9 w-56 animate-pulse rounded bg-gray-200" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl bg-gray-100"
          />
        ))}
      </div>
      <div className="h-[360px] animate-pulse rounded-2xl bg-gray-100" />
      <div className="h-[360px] animate-pulse rounded-2xl bg-gray-100" />
    </div>
  );
}

export default function DashboardClient({
  forceEmpty = false,
  simulateDelay = false,
}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(() => {
    try {
      const saved = parseStoredOrders(window.localStorage.getItem("orders"));

      setOrders(forceEmpty ? [] : saved);
      setError("");
    } catch (err) {
      console.error("Dashboard order loading failed:", err);
      setError("Unable to read your saved orders. Check the orders data.");
    } finally {
      setLoading(false);
    }
  }, [forceEmpty]);

  useEffect(() => {
    let cancelled = false;
    let timer;

    function runLoad() {
      if (!cancelled) loadOrders();
    }

    setLoading(true);

    if (simulateDelay) {
      timer = window.setTimeout(runLoad, 1500);
    } else {
      runLoad();
    }

    function handleStorage(event) {
      if (event.key === "orders" || event.key === null) {
        runLoad();
      }
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener("ordersUpdated", runLoad);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("ordersUpdated", runLoad);
    };
  }, [loadOrders, simulateDelay]);

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <section
        role="alert"
        className="rounded-2xl border border-red-200 bg-white p-8"
      >
        <h1 className="text-xl font-bold text-red-800">
          Unable to load dashboard
        </h1>
        <p className="mt-2 text-gray-700">{error}</p>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            loadOrders();
          }}
          className="mt-4 rounded-lg bg-[#244b36] px-4 py-2 font-bold text-white"
        >
          Try again
        </button>
      </section>
    );
  }

  const summary = aggregateOrders(orders);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wider text-[#bd7137]">
          Adis Eats · Overview
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#203b2d]">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Revenue and order activity from this browser.
        </p>
      </header>

      {orders.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-[#cdd8cc] bg-white p-10 text-center">
          <h2 className="text-lg font-bold text-[#203b2d]">No orders yet</h2>
          <p className="mt-2 text-sm text-gray-600">
            Place an order to see dashboard summaries and charts.
          </p>
        </section>
      ) : (
        <>
          <section
            aria-label="Order summary"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            <SummaryCard
              title="Total revenue"
              value={formatETB(summary.totalRevenue)}
              detail="Excluding cancelled orders"
            />
            <SummaryCard
              title="Total orders"
              value={summary.totalOrders.toLocaleString()}
              detail="Including cancelled orders"
            />
            <SummaryCard
              title="Active orders"
              value={summary.activeOrders.toLocaleString()}
              detail="Not delivered or cancelled"
            />
            <SummaryCard
              title="Average order value"
              value={formatETB(summary.averageOrderValue)}
              detail="Per non-cancelled order"
            />
          </section>

          <RevenueChart
            dailyRevenue={summary.dailyRevenue}
            dailyOrders={summary.dailyOrders}
          />
        </>
      )}
    </div>
  );
}

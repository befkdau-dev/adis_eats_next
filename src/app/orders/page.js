// app/orders/page.js
"use client";

import useSWR from "swr";
import Link from "next/link";
import { fetcher } from "@/app/lib/fetcher";
import { useAuth } from "@/app/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
export default function OrdersPage() {
  const { user, openLogin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const { data, error, isLoading } = useSWR(
    user ? "/api/orders" : null,
    fetcher,
  );

  function handleLogin() {
    router.push(`/login?next=${encodeURIComponent(pathname)}`);
  }
  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Log in to see your orders.</p>
        <button
          onClick={handleLogin}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Log in
        </button>
      </div>
    );
  }

  if (isLoading) return <p className="text-gray-500">Loading orders...</p>;
  if (error) return <p className="text-red-600">Could not load your orders.</p>;

  const orders = data.orders;

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">No orders yet</h1>
        <Link href="/menu" className="text-orange-600 hover:underline">
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex justify-between font-semibold">
              <span>{order.id}</span>
              <span>{order.total} birr</span>
            </div>
            <p className="text-xs text-gray-500 mb-1">
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-orange-600 capitalize">
              {order.status.replace(/-/g, " ")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

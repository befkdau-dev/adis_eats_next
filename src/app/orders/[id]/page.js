// app/orders/[id]/page.js
import { getOrder } from "@/app/lib/orderStore";
import OrderDetail from "./orderDetail";
import { notFound } from "next/navigation";

export default async function OrderPage({ params }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();
  return <OrderDetail id={id} initialOrder={order} />;
}

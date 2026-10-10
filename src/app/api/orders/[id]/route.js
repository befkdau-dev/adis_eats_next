import { NextResponse } from "next/server";
import { getOrder, updateOrderStatus } from "@/app/lib/orderStore";
export const dynamic = "force-dynamic";

const VALID_STATUSES = [
  "received",
  "preparing",
  "out-for-delivery",
  "delivered",
];

export async function GET(request, { params }) {
  const { id } = await params;
  const order = await getOrder(id);
  console.log(order);
  if (!order) {
    return NextResponse.json(
      { error: `order not find with id ${id}` },
      { status: 404 },
    );
  }

  return NextResponse.json({ order });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: `Invalid json body` }, { status: 400 });
  }
  const status = body?.status;
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: `Unkown status` }, { status: 400 });
  }

  const updatedOrder = await updateOrderStatus(id, status);
  if (!updatedOrder) {
    return NextResponse.json(
      { error: `no order found with id ${id}` },
      { status: 404 },
    );
  }
  return NextResponse.json({ order: updatedOrder });
}

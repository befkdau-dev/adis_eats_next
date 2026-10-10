import { NextResponse } from "next/server";
import { buildOrder } from "@/app/lib/orders";
import { getSession } from "@/app/lib/session";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";
const ORDERS_FILE = path.join(
  process.cwd(),
  "src",
  "app",
  "data",
  "orders.json",
);
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = await buildOrder({
    customer: body?.customer,
    items: body?.items,
  });

  if (result.errors) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  return NextResponse.json({ order: result.order }, { status: 201 });
}

export async function GET() {
  const session = await getSession();
  const userId = session.payload.userId;
  if (!session)
    return NextResponse.json({ error: "unahutorized" }, { status: 401 });
  let orders;
  try {
    orders = JSON.parse(await fs.readFile(ORDERS_FILE, "utf8"));
  } catch {}
  const userOrders = orders.filter((order) => order.usrId === userId);

  return NextResponse.json({ orders: userOrders });
}

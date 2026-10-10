import { promises as fs } from "fs";
import path from "path";
const ORDERS_FILE = path.join(
  process.cwd(),
  "src",
  "app",
  "data",
  "orders.json",
);

export async function readOrders() {
  try {
    return JSON.parse(await fs.readFile(ORDERS_FILE, "utf8"));
  } catch {
    return [];
  }
}
export async function writeOrders(orders) {
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

export async function saveOrders(order) {
  const orders = await readOrders();
  orders.push(order);
  await writeOrders(orders);
}

export async function getOrder(id) {
  const orders = await readOrders();
  const order = orders.find((order) => order.id === id) ?? null;
  return order;
}
export async function updateOrderStatus(id, status) {
  const orders = await readOrders();
  const index = orders.findIndex((item) => item.id === id);
  if (index === -1) return null;

  orders[index] = { ...orders[index], status };
  await writeOrders(orders);
  return orders[index];
}

"use server";

import { buildOrder } from "./orders";
import { saveOrders } from "./orderStore";
import { getSession } from "./session";

export async function placeOrder({ customer, items }) {
  const session = await getSession();
  const userId = session.payload.userId;
  if (!session) {
    return { errors: { _server: "You must be logged in to place an order" } };
  }

  const result = await buildOrder({ customer, items, userId });
  if (result.order) {
    try {
      await saveOrders(result.order);
    } catch (err) {
      console.error("Failed to save order server-side:", err);
    }
  }

  return result;
}

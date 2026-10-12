// app/lib/order-actions.js — unchanged otherwise, this part is now simpler
export async function placeOrder({ customer, items }) {
  const session = await getSession();
  if (!session) {
    return { errors: { _server: "You must be logged in to place an order" } };
  }

  const result = await buildOrder({ customer, items, userId: session.userId });

  if (result.order) {
    await saveOrder(result.order); // in-memory push, won't throw
  }

  return result;
}

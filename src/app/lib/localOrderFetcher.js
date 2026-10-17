export async function localOrderFetcher(key) {
  const orderId = key.split(":")[1];

  const storageKeys = ["orders", "order"];

  for (const storageKey of storageKeys) {
    const savedData = localStorage.getItem(storageKey);

    if (!savedData) continue;

    try {
      const parsed = JSON.parse(savedData);

      const orders = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.orders)
          ? parsed.orders
          : [parsed];

      const order = orders.find((item) => String(item?.id) === String(orderId));

      if (order) return order;
    } catch {
      console.error(`Invalid order data in "${storageKey}".`);
    }
  }

  throw new Error("Order not found in localStorage.");
}

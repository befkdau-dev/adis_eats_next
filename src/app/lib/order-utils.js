export function formatETB(value) {
  return `ETB ${Number(value || 0).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
}

export function parseStoredOrders(raw) {
  if (!raw) return [];

  const parsed = JSON.parse(raw);
  const orders = Array.isArray(parsed) ? parsed : parsed?.orders;

  if (!Array.isArray(orders)) {
    throw new Error(
      'The "orders" localStorage value must be an array or contain an orders array.',
    );
  }

  return orders.map((order, index) => {
    const items = Array.isArray(order.items) ? order.items : [];
    const customer =
      order.customer && typeof order.customer === "object"
        ? order.customer
        : {};

    const itemTotal = items.reduce((sum, item) => {
      const price = Number(item.price ?? item.unitPrice ?? 0);
      const quantity = Number(item.quantity ?? item.qty ?? 1);
      return sum + price * quantity;
    }, 0);

    const totalValue =
      order.total ??
      order.totalAmount ??
      order.grandTotal ??
      order.amount ??
      itemTotal;

    const dateValue =
      order.createdAt ??
      order.created_at ??
      order.orderDate ??
      order.date ??
      order.timestamp;

    const date = dateValue ? new Date(dateValue) : null;
    const validDate =
      date && !Number.isNaN(date.getTime()) ? date.toISOString() : null;

    return {
      ...order,
      id: String(order.id ?? order.orderId ?? `order-${index + 1}`),
      customerName:
        order.customerName ??
        order.name ??
        customer.name ??
        customer.fullName ??
        "Guest customer",
      total: Number(totalValue) || 0,
      status: String(order.status ?? "received").toLowerCase(),
      createdAt: validDate,
      items,
    };
  });
}

export function aggregateOrders(orders, now = new Date()) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    return {
      key,
      label: date.toLocaleDateString("en", {
        month: "short",
        day: "numeric",
      }),
      revenue: 0,
      orders: 0,
    };
  });

  const dailyMap = new Map(days.map((day) => [day.key, day]));

  for (const order of orders) {
    if (!order.createdAt) continue;

    const date = new Date(order.createdAt);
    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    const day = dailyMap.get(key);
    if (!day) continue;

    day.orders += 1;

    if (order.status !== "cancelled") {
      day.revenue += order.total;
    }
  }

  const nonCancelled = orders.filter((order) => order.status !== "cancelled");

  const totalRevenue = nonCancelled.reduce(
    (sum, order) => sum + order.total,
    0,
  );

  return {
    totalOrders: orders.length,
    totalRevenue,
    activeOrders: orders.filter(
      (order) => !["delivered", "cancelled"].includes(order.status),
    ).length,
    averageOrderValue: nonCancelled.length
      ? totalRevenue / nonCancelled.length
      : 0,
    dailyRevenue: days.map(({ key, label, revenue }) => ({
      day: key,
      label,
      revenue,
    })),
    dailyOrders: days.map(({ key, label, orders: count }) => ({
      day: key,
      label,
      orders: count,
    })),
  };
}

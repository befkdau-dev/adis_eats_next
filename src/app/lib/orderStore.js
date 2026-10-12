// app/lib/orderStore.js

// In-memory store — same caveat as users.js: resets on server restart.
let orders = [
  {
    id: "ORD-A1B2C3D4",
    userId: "11111111-1111-1111-1111-111111111111",
    customer: {
      name: "Abel Tesfaye",
      phone: "0911223344",
      address: "Bole, Addis Ababa",
      notes: "",
    },
    items: [
      { id: 1, name: "Doro Wat", price: 350, quantity: 2, subtotal: 700 },
      { id: 6, name: "Misir Wat", price: 220, quantity: 1, subtotal: 220 },
    ],
    total: 920,
    status: "received",
    createdAt: "2026-10-10T08:00:00.000Z",
  },
  {
    id: "ORD-E5F6G7H8",
    userId: "11111111-1111-1111-1111-111111111111",
    customer: {
      name: "Abel Tesfaye",
      phone: "0911223344",
      address: "Bole, Addis Ababa",
      notes: "Extra spicy please",
    },
    items: [{ id: 2, name: "Kitfo", price: 450, quantity: 1, subtotal: 450 }],
    total: 450,
    status: "preparing",
    createdAt: "2026-10-11T12:30:00.000Z",
  },
];

export async function saveOrder(order) {
  orders.push(order);
}

export async function getOrder(id) {
  return orders.find((o) => o.id === id) ?? null;
}

export async function updateOrderStatus(id, status) {
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  orders[index] = { ...orders[index], status };
  return orders[index];
}

export async function getOrdersByUser(userId) {
  return orders
    .filter((o) => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

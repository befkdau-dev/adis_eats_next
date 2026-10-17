import AdminOrdersClient from "./AdminOrdersClient";

export const metadata = {
  title: "Order Management | Adis Eats",
  description: "Review customer orders and manage order status.",
};

export default function AdminOrdersPage() {
  return <AdminOrdersClient />;
}

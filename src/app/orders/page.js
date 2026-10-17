import OrdersList from "./OrdersList";

export const metadata = {
  title: "My Orders",
  description: "View your Adis Eats orders and order details.",
};

export default function OrdersPage() {
  return <OrdersList />;
}

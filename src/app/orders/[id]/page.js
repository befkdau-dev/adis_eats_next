import OrderDetailClient from "./OrderDetailClient";

export const metadata = {
  title: "Order Details",
  description: "View your Adis Eats order details and status.",
};

export default async function OrderDetailPage({ params }) {
  const { id } = await params;

  return <OrderDetailClient orderId={id} />;
}

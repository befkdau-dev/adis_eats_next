import OrderConfirmation from "./OrderConfirmation";

export default async function SuccessPage({ searchParams }) {
  const { orderId } = await searchParams;
  return <OrderConfirmation orderId={orderId} />;
}

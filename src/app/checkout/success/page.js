import SuccessClient from "./SuccessClient";

export const metadata = {
  title: "Order Confirmation | Adis Eats",
  robots: { index: false, follow: false },
};

export default async function SuccessPage({ searchParams }) {
  const { orderId = "" } = await searchParams;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <SuccessClient orderId={orderId} />
    </main>
  );
}

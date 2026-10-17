import TrackingClient from "./TrackingClient";

export const metadata = {
  title: "Track Your Order | Adis Eats",
  description: "View your Adis Eats order status and delivery details.",
};

export default async function TrackOrderPage({ params }) {
  const { id } = await params;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <TrackingClient id={id} />
    </main>
  );
}

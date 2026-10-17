import CartClient from "./CartClient";

export const metadata = {
  title: "Your Cart | Adis Eats",
  description: "Review your selected Ethiopian dishes.",
};

export default function CartPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[#193b2a]">Your Cart</h1>
      <p className="mt-2 mb-8 text-gray-600">
        Review your dishes before checking out.
      </p>
      <CartClient />
    </main>
  );
}

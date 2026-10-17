import CheckoutForm from "./CheckoutForm";

export const metadata = {
  title: "Checkout | Adis Eats",
  description: "Complete your Adis Eats order.",
};

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-[#193b2a]">Checkout</h1>
      <p className="mb-8 mt-2 text-gray-600">
        Enter your details to complete your order.
      </p>
      <CheckoutForm />
    </main>
  );
}

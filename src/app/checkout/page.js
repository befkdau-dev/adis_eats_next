import CheckoutForm from "./CheckoutForm";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}

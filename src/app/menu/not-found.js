import Link from "next/link";

export default function MenuNotFound() {
  return (
    <section>
      <h1 className="text-2xl font-bold">Dish not found</h1>
      <p className="mt-2">
        Sorry, we couldn't find the dish you're looking for.
      </p>

      <Link href="/menu" className="mt-4 inline-block underline">
        Return to menu
      </Link>
    </section>
  );
}

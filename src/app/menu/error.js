"use client";

export default function MenuError({ error, reset }) {
  return (
    <section role="alert">
      <h2>Something went wrong with the menu.</h2>
      <p>Please try again.</p>

      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 rounded bg-black px-4 py-2 text-white"
      >
        Try again
      </button>
    </section>
  );
}

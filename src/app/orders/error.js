"use client";

export default function AdminOrdersError({ error, reset }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <section
        role="alert"
        className="rounded-2xl border border-red-200 bg-white p-8"
      >
        <p className="text-sm font-bold uppercase tracking-wider text-red-700">
          Something went wrong
        </p>

        <h1 className="mt-2 text-2xl font-extrabold text-[#244b36]">
          We couldn't open the orders page
        </h1>

        <p className="mt-3 text-gray-600">
          Try loading the page again. If the problem continues, check the
          application logs.
        </p>

        {process.env.NODE_ENV === "development" && error?.message && (
          <pre className="mt-4 overflow-x-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-700">
            {error.message}
          </pre>
        )}

        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 min-h-11 rounded-lg bg-[#244b36] px-5 py-3 font-bold text-white hover:bg-[#183a28]"
        >
          Try again
        </button>
      </section>
    </main>
  );
}

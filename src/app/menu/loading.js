export default function Loading() {
  return (
    <section aria-label="Loading menu" aria-busy="true">
      <div className="mb-4 h-8 w-48 animate-pulse rounded bg-gray-200" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse rounded-lg bg-gray-200"
          />
        ))}
      </div>
    </section>
  );
}

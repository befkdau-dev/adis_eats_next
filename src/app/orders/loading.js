export default function AdminOrdersLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading admin orders"
      className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
      <div className="h-9 w-64 animate-pulse rounded bg-gray-200" />
      <div className="h-5 w-80 max-w-full animate-pulse rounded bg-gray-100" />

      <div className="overflow-hidden rounded-2xl border border-[#e9e7dc] bg-white p-5">
        <div className="mb-5 h-8 w-40 animate-pulse rounded bg-gray-100" />

        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-4 border-t border-gray-100 py-5"
          >
            {Array.from({ length: 5 }, (_, cell) => (
              <div
                key={cell}
                className="h-5 animate-pulse rounded bg-gray-100"
              />
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}

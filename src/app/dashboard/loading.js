export default function DashboardLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading dashboard"
      className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
      <div className="h-9 w-56 animate-pulse rounded bg-gray-200" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl bg-gray-100"
          />
        ))}
      </div>

      {Array.from({ length: 2 }, (_, index) => (
        <div
          key={index}
          className="space-y-4 rounded-2xl border border-[#e9e7dc] bg-white p-6"
        >
          <div className="h-6 w-56 animate-pulse rounded bg-gray-200" />
          <div className="h-[320px] animate-pulse rounded-xl bg-gray-100" />
          <div className="h-20 animate-pulse rounded bg-gray-100" />
        </div>
      ))}
    </main>
  );
}

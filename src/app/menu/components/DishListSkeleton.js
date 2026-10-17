export default function DishListSkeleton() {
  return (
    <div
      aria-label="Loading dishes"
      aria-busy="true"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-[#e9e7dc] bg-white"
        >
          <div className="aspect-[4/3] animate-pulse bg-[#e9eee6]" />

          <div className="space-y-3 p-4">
            <div className="h-5 w-2/3 animate-pulse rounded bg-[#e9eee6]" />
            <div className="h-4 w-full animate-pulse rounded bg-[#f1eee5]" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-[#f1eee5]" />
          </div>
        </div>
      ))}
    </div>
  );
}

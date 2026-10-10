export default function DishListSkelton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-gray-200 p-4 animate-pulse"
        >
          <div className="h-10 bg-gray-200 rounded w-8/3 mb-2" />
          <div className="h-8 bg-gray-200 rounded w-full mb-1" />
          <div className="h-8 bg-gray-200 rounded w-12/4" />
        </div>
      ))}
    </div>
  );
}

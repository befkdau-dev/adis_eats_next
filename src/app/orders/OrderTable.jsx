import Link from "next/link";

const COLUMNS = [
  { key: "id", label: "Order ID" },
  { key: "customerName", label: "Customer" },
  { key: "total", label: "Total" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Date" },
];

function buildUrl(basePath, sort, direction, page) {
  const params = new URLSearchParams({
    sort,
    dir: direction,
    page: String(page),
  });

  return `${basePath}?${params.toString()}`;
}

function formatETB(value) {
  return `${Number(value || 0).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })} ETB`;
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString();
}

function StatusBadge({ status }) {
  const normalized = String(status || "pending").toLowerCase();

  const styles = {
    received: "bg-blue-50 text-blue-700",
    pending: "bg-amber-50 text-amber-700",
    preparing: "bg-orange-50 text-orange-700",
    "out-for-delivery": "bg-purple-50 text-purple-700",
    delivered: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${
        styles[normalized] || "bg-gray-100 text-gray-700"
      }`}
    >
      {normalized.replaceAll("-", " ")}
    </span>
  );
}

export default function OrderTable({
  orders,
  sort = "createdAt",
  direction = "desc",
  page = 1,
  pageSize = 5,
  totalCount = orders.length,
  basePath = "/admin/orders",
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  function getSortUrl(key) {
    const nextDirection =
      sort === key
        ? direction === "asc"
          ? "desc"
          : "asc"
        : ["total", "createdAt"].includes(key)
          ? "desc"
          : "asc";

    return buildUrl(basePath, key, nextDirection, 1);
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#e9e7dc] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e9e7dc] px-5 py-4">
        <div>
          <h2 className="font-bold text-[#244b36]">Order records</h2>
          <p className="mt-1 text-sm text-gray-500">
            {totalCount.toLocaleString()} order(s)
          </p>
        </div>

        <p className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-[#f7f8f3] text-xs uppercase tracking-wide text-gray-600">
            <tr>
              {COLUMNS.map((column) => {
                const active = sort === column.key;
                const ariaSort = active
                  ? direction === "asc"
                    ? "ascending"
                    : "descending"
                  : "none";

                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={ariaSort}
                    className="whitespace-nowrap px-5 py-4 font-bold"
                  >
                    <Link
                      href={getSortUrl(column.key)}
                      className="inline-flex items-center gap-1 rounded hover:text-[#bd7137] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244b36]"
                    >
                      {column.label}
                      <span aria-hidden="true">
                        {active ? (direction === "asc" ? "↑" : "↓") : "↕"}
                      </span>
                    </Link>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e9e7dc]">
            {orders.map((order) => (
              <tr key={order.id} className="transition hover:bg-[#fffdf8]">
                <th
                  scope="row"
                  className="whitespace-nowrap px-5 py-4 font-semibold text-[#244b36]"
                >
                  #{order.id}
                </th>

                <td className="px-5 py-4 text-gray-700">
                  {order.customerName || "Guest customer"}
                </td>

                <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#244b36]">
                  {formatETB(order.total)}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={order.status} />
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                  {formatDate(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav
        aria-label="Order table pagination"
        className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e9e7dc] px-5 py-4"
      >
        <p className="text-sm text-gray-500">
          Showing {totalCount === 0 ? 0 : (page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, totalCount)} of {totalCount}
        </p>

        <div className="flex gap-2">
          {page > 1 ? (
            <Link
              href={buildUrl(basePath, sort, direction, page - 1)}
              rel="prev"
              className="inline-flex min-h-10 items-center rounded-lg border border-[#d8dfd4] px-4 py-2 font-semibold text-[#244b36] hover:bg-[#f7f8f3]"
            >
              Previous
            </Link>
          ) : (
            <span className="inline-flex min-h-10 items-center rounded-lg border border-gray-200 px-4 py-2 text-gray-400">
              Previous
            </span>
          )}

          {page < totalPages ? (
            <Link
              href={buildUrl(basePath, sort, direction, page + 1)}
              rel="next"
              className="inline-flex min-h-10 items-center rounded-lg bg-[#244b36] px-4 py-2 font-semibold text-white hover:bg-[#183a28]"
            >
              Next
            </Link>
          ) : (
            <span className="inline-flex min-h-10 items-center rounded-lg border border-gray-200 px-4 py-2 text-gray-400">
              Next
            </span>
          )}
        </div>
      </nav>
    </section>
  );
}

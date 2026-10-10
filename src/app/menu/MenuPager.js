// app/menu/MenuPager.js
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function MenuPager({ page, totalPages }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goTo = (n) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(n));
    router.push(`/menu?${params}`);
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-4 text-sm">
      <button
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-gray-600">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

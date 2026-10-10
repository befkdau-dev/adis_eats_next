// app/menu/FilterShell.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/app/lib/fetcher";
import { useDebouncedValue } from "../lib/useDebounceValue";
import DishList from "./DishList";

const categories = ["All", "Main Course", "Vegetarian", "Breakfast"];

export default function FilterShell({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "All";

  const [term, setTerm] = useState("");
  const debouncedTerm = useDebouncedValue(term, 400);

  // page lives in the query string, same pattern as category
  const page = Number(searchParams.get("page")) || 1;

  const handleCategoryClick = (selected) => {
    const params = new URLSearchParams();
    if (selected !== "All") params.set("category", selected);
    // changing category resets paging back to page 1
    router.push(params.toString() ? `/menu?${params}` : "/menu");
  };

  const goToPage = (n) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(n));
    router.push(`/menu?${params}`);
  };

  // Reset to page 1 whenever the search term changes
  useEffect(() => {
    if (debouncedTerm && page !== 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      router.push(`/menu?${params}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTerm]);

  // null key => no API call while the search box is empty
  const key = debouncedTerm
    ? `/api/dishes?search=${encodeURIComponent(debouncedTerm)}&category=${encodeURIComponent(category)}&page=${page}`
    : null;

  const { data, error, isLoading } = useSWR(key, fetcher);

  return (
    <div>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search dishes..."
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4 focus:outline-none focus:border-orange-500"
      />

      <nav className="flex gap-2 mb-4">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => handleCategoryClick(c)}
            className={
              category === c
                ? "px-3 py-1 rounded bg-orange-600 text-white text-sm font-medium"
                : "px-3 py-1 rounded text-gray-700 hover:bg-gray-100 text-sm"
            }
          >
            {c}
          </button>
        ))}
      </nav>

      {debouncedTerm ? (
        <>
          {isLoading && <p className="text-sm text-gray-400">Searching...</p>}
          {error && (
            <p className="text-sm text-red-500">Could not search right now.</p>
          )}
          {data && (
            <>
              <DishList dishes={data.dishes} />
              {data.totalPages > 1 && (
                <Pager
                  page={data.page}
                  totalPages={data.totalPages}
                  onChange={goToPage}
                />
              )}
            </>
          )}
        </>
      ) : (
        children
      )}
    </div>
  );
}

function Pager({ page, totalPages, onChange }) {
  return (
    <div className="flex items-center justify-center gap-3 mt-4 text-sm">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-gray-600">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

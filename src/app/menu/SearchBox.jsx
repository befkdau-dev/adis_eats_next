"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/app/lib/fetcher";

const PAGE_SIZE = 6;

export default function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") || "";
  const rawPage = Number(searchParams.get("page") || 1);
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const [term, setTerm] = useState(urlQuery);
  const [debouncedTerm, setDebouncedTerm] = useState(urlQuery);

  // Keep the input synchronized with browser navigation.
  useEffect(() => {
    setTerm(urlQuery);
    setDebouncedTerm(urlQuery);
  }, [urlQuery]);

  // Debounce the search input.
  useEffect(() => {
    const timer = setTimeout(() => {
      const nextTerm = term.trim();

      setDebouncedTerm(nextTerm);

      const params = new URLSearchParams(window.location.search);

      if (nextTerm) {
        params.set("q", nextTerm);
      } else {
        params.delete("q");
      }

      // A new search always starts on page one.
      params.delete("page");

      const queryString = params.toString();
      const nextUrl = queryString ? `/menu?${queryString}` : "/menu";

      router.replace(nextUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(timer);
  }, [term, router]);

  const activePage = debouncedTerm === urlQuery ? page : 1;

  // A null key disables fetching until a search term exists.
  const key = debouncedTerm
    ? `/api/dishes?q=${encodeURIComponent(
        debouncedTerm,
      )}&page=${activePage}&limit=${PAGE_SIZE}`
    : null;

  const { data, error, isLoading, isValidating } = useSWR(key, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  function goToPage(nextPage) {
    const params = new URLSearchParams(window.location.search);
    params.set("q", debouncedTerm);
    params.set("page", String(nextPage));

    router.push(`/menu?${params.toString()}`, {
      scroll: false,
    });
  }

  const dishes = data?.dishes || [];
  const pagination = data?.pagination;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <label
        htmlFor="dish-search"
        className="mb-2 block text-sm font-bold text-[#244b36]"
      >
        Search Ethiopian dishes
      </label>

      <input
        id="dish-search"
        type="search"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Try kitfo, doro wat, or shiro..."
        className="w-full rounded-xl border border-[#dce5d9] bg-white px-4 py-3 text-[#203b2d] outline-none transition focus:border-[#244b36] focus:ring-2 focus:ring-[#244b36]/15"
      />

      {!term.trim() && (
        <p className="mt-3 text-sm text-gray-600">
          Enter a dish name or ingredient to search the menu.
        </p>
      )}

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {error.message || "Unable to load search results."}
        </p>
      )}

      {debouncedTerm && isLoading && !data && (
        <p className="mt-5 text-sm text-gray-600">Searching dishes...</p>
      )}

      {debouncedTerm && data && (
        <div className="mt-6" aria-busy={isValidating}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-gray-600">
              {pagination.total} result
              {pagination.total === 1 ? "" : "s"} for{" "}
              <strong>{debouncedTerm}</strong>
            </p>

            {isValidating && (
              <span className="text-xs text-gray-500">Updating results...</span>
            )}
          </div>

          {dishes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dishes.map((dish) => (
                <article
                  key={dish.id}
                  className="rounded-2xl border border-[#e9e7dc] bg-white p-5 shadow-sm"
                >
                  <h2 className="text-lg font-bold text-[#244b36]">
                    {dish.name}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                    {dish.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="font-bold text-[#bd7137]">
                      {Number(dish.price).toLocaleString("en-US")} ETB
                    </span>

                    <a
                      href={`/menu/${dish.slug || dish.id}`}
                      className="text-sm font-bold text-[#244b36] underline underline-offset-4"
                    >
                      View dish
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            !isLoading && (
              <p className="rounded-xl bg-[#edf2e9] p-5 text-sm text-[#203b2d]">
                No dishes matched your search.
              </p>
            )
          )}

          {pagination.totalPages > 1 && (
            <nav
              aria-label="Search result pages"
              className="mt-6 flex flex-wrap items-center justify-center gap-3"
            >
              <button
                type="button"
                disabled={activePage <= 1}
                onClick={() => goToPage(activePage - 1)}
                className="rounded-lg border border-[#dce5d9] px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {activePage} of {pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={activePage >= pagination.totalPages}
                onClick={() => goToPage(activePage + 1)}
                className="rounded-lg border border-[#dce5d9] px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          )}
        </div>
      )}
    </section>
  );
}

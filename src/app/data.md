```markdown
# Adis Eats — Data Fetching Guide

This document records the data queries used by the application,
their cache keys, refresh behavior, and purpose.

## 1. Menu search and pagination

**Component:** `src/app/menu/SearchBox.jsx`

**Endpoint:** `GET /api/dishes`

**SWR key:**

`/api/dishes?q=${encodeURIComponent(searchTerm)}&page=${page}&limit=6`

**Refresh rule:**

- Search input is debounced by 300 ms.
- Changing the search term creates a new SWR cache key.
- Changing the page creates a new SWR cache key.
- `keepPreviousData: true` retains previous results while a new
  query loads.
- `revalidateOnFocus: false` avoids automatic refetching when
  the browser window regains focus.
- Empty search uses a `null` key, so SWR does not fetch results.

**Why:**
Debouncing avoids sending a request for every keystroke.
Pagination limits the number of returned dishes. Keeping previous
data reduces visual flashing between search results.

## 2. Order detail polling

**Server page:** `src/app/orders/[id]/page.js`

**Client component:** `src/app/orders/[id]/OrderPolling.jsx`

**Endpoint:** `GET /api/order-status/[id]`

**SWR key:**

`/api/order-status/${encodeURIComponent(orderId)}`

**Initial data:** The Server Component passes the order to the
client component through `fallbackData`.

**Refresh rule:**

- Revalidate every 5,000 milliseconds.
- Revalidate when the browser window regains focus.
- Keep displaying the last available data if a later request fails.

**Why:**
The server provides the initial order for the first render.
SWR then checks for updated data every five seconds without
requiring a manual page refresh.

**Current limitation:**
The order endpoint uses demo data. It does not read orders stored
in browser localStorage, and the demo order does not change
automatically. Real order-status updates require a shared,
server-accessible data source.

## 3. Server-side initial order lookup

**Function:** `getDemoOrder(id)`

**File:** `src/app/lib/demo-orders.js`

**Cache key:** Not an SWR query.

**Refresh rule:** Runs when the Server Component renders.

**Why:**
The initial order is loaded on the server so the page can render
its content before client-side polling begins.

## Shared fetcher

**File:** `src/app/lib/fetcher.js`

All SWR requests use the same fetcher for JSON parsing and HTTP
error handling. This avoids duplicating request logic across
components.

## Adding a new query

For every new SWR query, document:

1. The component that owns the query.
2. The endpoint or data source.
3. The exact SWR key.
4. The refresh and revalidation rules.
5. Whether initial data is provided.
6. Why the query needs its particular caching behavior.
```

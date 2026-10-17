# Adis Eats — Rendering Strategy

| Route             | Strategy                    | Why                                                         |
| ----------------- | --------------------------- | ----------------------------------------------------------- |
| /                 | Static                      | Homepage content comes from build-time data.                |
| /menu             | Static + ISR                | Revalidate menu output every 3600 seconds.                  |
| /menu/[id]        | Static generation           | generateStaticParams creates pages for known dish IDs.      |
| /cart             | Client-side state           | Cart contents belong to the current browser's localStorage. |
| /checkout         | Dynamic rendering           | Reads the request-specific session cookie.                  |
| /checkout/success | Static or dynamic as needed | Depends on whether it reads order-specific request data.    |

## Layouts

- app/layout.js owns html, body, the global header, footer, and globals.css.
- app/menu/layout.js owns the persistent category sidebar.
- The menu layout wraps both the menu list and individual dish pages.

## Suspense

- app/menu/page.js wraps the asynchronous dish-list component in Suspense.
- The menu layout and category sidebar remain outside that boundary.
- With synchronous JSON data, the loading fallback may not be visible.

## Static dish generation

- generateStaticParams reads all dish IDs from menu.json.
- Current menu size: 10 dishes.
- Expected generated dish paths: 10.
- Confirm the final output with npm run build.

## Storage limitations

- localStorage is browser-specific and is not shared between users or devices.
- Server Components cannot directly read localStorage.
- Static menu JSON is read-only application data, not persistent writable storage.

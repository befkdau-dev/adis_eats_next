# Adis Eats — Server and Client Component Boundaries

| Component                                 | Runs on                     | Reason                                                                         |
| ----------------------------------------- | --------------------------- | ------------------------------------------------------------------------------ |
| `app/layout.js`                           | Server                      | Owns the HTML document, metadata, global styles, header and footer.            |
| `app/providers.jsx`                       | Client                      | Provides the cart context to components that need client-side cart state.      |
| `context/CartProvider.jsx`                | Client                      | Manages cart state and browser `localStorage`.                                 |
| `app/page.js`                             | Server by default           | Renders the homepage and reads menu data on the server.                        |
| `app/menu/layout.js`                      | Server                      | Owns the persistent menu sidebar and shared menu layout.                       |
| `app/menu/page.js`                        | Server, async               | Loads menu data without client-side fetching hooks.                            |
| `app/menu/CategoryBar.jsx`                | Client                      | Reserved for interactive category filtering; currently uses anchor navigation. |
| `app/menu/FilterShell.jsx`                | Client                      | Demonstrates passing Server Component content through the `children` slot.     |
| `app/menu/components/DishList.js`         | Server                      | Renders dish cards from server-provided data.                                  |
| `app/menu/components/DishListSkeleton.js` | Server-compatible           | Renders a static loading placeholder.                                          |
| `app/menu/[id]/page.js`                   | Server                      | Generates known dish routes and renders dish details.                          |
| `app/cart/page.js`                        | Depends on implementation   | Can remain a Server Component if it only renders a client cart component.      |
| `app/checkout/page.js`                    | Server, dynamic if required | Reads request-specific session data when checkout requires it.                 |

## Data flow

1. The menu page loads data using the server-side menu helper.
2. The server passes the resulting dish data to `DishList`.
3. `FilterShell` receives the server-rendered subtree through `children`; it does not import `DishList`.
4. `Providers` supplies cart context to components that consume it.
5. Browser storage is accessed only on the client.

## Bundle measurement

Record the actual `/menu` First Load JS values from successful builds.

- Before refactoring: [fill in the previous build measurement]
- After refactoring: [fill in the new build measurement]
- Difference: before minus after, in kB

Do not estimate bundle sizes. Use the build output from the same Next.js version and compare equivalent production builds.

/api/dishes?search={term}&category={category}&page={page}-->app/menu/FilterShell.js

Search results for the menu grid
debouncedTerm is empty — browsing by category alone uses the server-rendered list instead, no API call made

/api/orders/{id} --->app/orders/[id]/OrderDetail.js -->A single order, polled every 5s (refreshInterval: 5000) for live status Never — id always comes from the route segment

/api/orders/{id}--> app/checkout/success/OrderConfirmation.js--> The just-placed order, for the confirmation screen orderId is missing from searchParams

/api/orders/{id} -->app/orders/page.js → OrderRow One row per saved order id, fetched independently per row Never — only rendered once an id exists in orderIds

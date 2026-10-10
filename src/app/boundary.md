 <!-- Server Component
app/layout.js	                                Static shell, exports metadata, no state. Renders Providers and NavLinks as client islands.
app/page.js (home)	                            Reads getMenu() directly for featured dishes. No interactivity of its own.
app/menu/page.js	                            Awaits searchParams and getMenu(), filters on the server, wraps the result in FilterShell via children.

app/menu/[id]/page.js	                        Awaits params, calls getDish(id), calls notFound() for unknown dishes.
app/menu/DishList.js	                        Pure presentation of the (already filtered) dishes. Renders Link and the client AddToCartButton.
app/menu/DishListSkeleton.js	                Static placeholder markup for Suspense.
app/menu/loading.js	                            Loading UI for the menu segment.
app/menu/[id]/not-found.js / app/not-found.js	Static "not found" UI.
app/checkout/page.js	                        Thin wrapper. Exports dynamic = "force-dynamic" (segment config can't be exported from a client file) and renders CheckoutForm.
app/checkout/success/page.js	                Awaits searchParams and passes orderId down to a client component.


Client Components
app/Providers.js	                            Composes the context providers (useState, useEffect inside them). Single client boundary for global state.
context/CartContext.js	                        Cart state, persisted to localStorage (browser-only API).
context/AuthContext.js	                        User + login-modal state, persisted to sessionStorage.
context/OrdersContext.js                        Saved orders, persisted to localStorage.
components/LoginModal.js	                    Modal open/close state, keyboard listener, form state.
components/NavLinks.js	                        usePathname() for the active link, useAuth() for login/logout.
CartBadge.js	                                Reads totalItems from cart context.
menu/AddToCartButton.js	                        Click handler calling addItem from cart context.
menu/FilterShell.js	                            useRouter and useSearchParams to drive ?category=.
menu/error.js	                                Error boundaries must be Client Components.
cart/page.js	                                Reads live cart state from context (quantity +/-, clear).
checkout/CheckoutForm.js	                    Form state, auth and empty-cart guards, calls the Server Action.
checkout/success/OrderConfirmation.js	        Reads the saved order from localStorage via context.
orders/page.js	                                Reads order history from localStorage via context. -->

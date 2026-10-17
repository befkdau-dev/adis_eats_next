# Adis Eats Authentication

## Session

- The server issues a signed session token after validating credentials.
- The token is stored in an HTTP-only cookie named `session`.
- The cookie uses `secure` in production, `sameSite=lax`, and an
  eight-hour lifetime.
- `getSession()` verifies the cookie and returns the authenticated
  user ID, email, and role.

## /checkout

1. `proxy.js` checks for a valid session and redirects signed-out users.
2. The server page and every private mutation must independently
   verify the session before using private data.
3. The proxy redirect alone does not authorize an order or payment.

## /orders

1. `proxy.js` checks for a valid session.
2. The server data-access layer must query orders using the verified
   session user ID.
3. Orders currently stored in localStorage cannot be securely queried
   or isolated by the server. This remains incomplete until orders
   move to server-side storage.

## /kitchen

1. The kitchen Server Component calls `getSession()`.
2. It redirects signed-out users to sign-in.
3. It checks `session.role === "staff"` on the server.
4. A customer role must not be allowed to access staff data or actions.

## Safe redirects

- Sign-in accepts only a same-origin path beginning with one slash.
- External URLs, protocol-relative URLs, and backslash-based variants
  are rejected.
- The intended destination is passed using the `next` parameter.

## Current limitations

- Browser localStorage is not a trusted identity or authorization store.
- Server-side user records are required to validate credentials.
- Server-side order storage and ownership checks are required for
  genuine account isolation.
- Add rate limiting and appropriate CSRF protections before production.

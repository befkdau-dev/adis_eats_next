import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/app/lib/session-token";

export async function proxy(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    const signInUrl = new URL("/signin", request.url);

    signInUrl.searchParams.set(
      "next",
      request.nextUrl.pathname + request.nextUrl.search,
    );

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*"],
};

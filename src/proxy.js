import { NextResponse } from "next/server";
import { decrypt } from "@/app/lib/jwt";

export async function proxy(request) {
  const token = request.cookies.get("session")?.value;
  const session = await decrypt(token);

  if (!session) {
    const { pathname, search } = request.nextUrl;
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*"],
};

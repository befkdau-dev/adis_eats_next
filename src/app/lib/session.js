import "server-only";

import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  createSessionToken,
  verifySessionToken,
} from "./session-token";

export { SESSION_COOKIE, verifySessionToken };

export async function createSession(user) {
  return createSessionToken(user);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  return verifySessionToken(token);
}

import { cookies } from "next/headers";
import { decrypt, encypt } from "./jwt";

const MAX_AGE = 24 * 60 * 60 * 7;
const COOKIE_NAME = "session";

export async function createSession(payload) {
  const token = await encypt(payload);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: MAX_AGE,
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return decrypt(token);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

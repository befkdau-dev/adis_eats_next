"use server";
import { createUsers, verifyUser } from "./users";
import { createSession, deleteSession } from "./session";
import { safeNext } from "./safeNext";

export async function register({ name, email, password, next }) {
  if (name.trim().length < 2) return { error: "Enter your name" };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Enter a valid email" };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters" };

  const user = await createUsers(name, email, password);
  if (!user) return { error: "invalid email" };

  await createSession({ userId: user.id, name: user.name });
  return {
    user: { id: user.id, name: user.name },
    redirectTo: safeNext(next, "/"),
  };
}

export async function login({ email, password, next }) {
  const user = await verifyUser({ email, password });
  if (!user) return { error: "no user with this password" };

  await createSession({ userId: user.id, name: user.name, role: user.role });
  return {
    user: { id: user.id, name: user.name, role: user.role },
    redirectTo: safeNext(next, "/"),
  };
}

export async function logout() {
  await deleteSession();
}

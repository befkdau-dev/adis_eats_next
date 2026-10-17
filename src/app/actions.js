"use server";

import { validateOrder } from "@/app/lib/validate-order";

import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSession, SESSION_COOKIE } from "@/app/lib/session";

const sampleUsers = [
  {
    id: "user_customer_001",
    email: "customer@adis-eats.test",
    password: "Customer123!",
    role: "customer",
  },
  {
    id: "user_staff_001",
    email: "staff@adis-eats.test",
    password: "Staff123!",
    role: "staff",
  },
];

function safeNext(value) {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return "/";
  }

  try {
    const url = new URL(value, "https://adis-eats.invalid");

    if (url.origin !== "https://adis-eats.invalid") {
      return "/";
    }

    return url.pathname + url.search + url.hash;
  } catch {
    return "/";
  }
}

export async function signInAction(formData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const next = safeNext(formData.get("next"));

  const user = sampleUsers.find((item) => item.email === email);

  // Demo only: sample credentials are hardcoded.
  if (!user || user.password !== password) {
    redirect("/signin?error=invalid");
  }

  const token = await createSession(user);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect(next);
}

export async function placeOrder(previousState, formData) {
  const rawItems = formData.get("items");

  let items;

  try {
    items = JSON.parse(rawItems || "[]");
  } catch {
    return {
      success: false,
      message: "The cart data is invalid.",
      fieldErrors: {
        items: ["Please refresh your cart and try again."],
      },
    };
  }

  const result = validateOrder({
    name: String(formData.get("name") || ""),
    phone: String(formData.get("phone") || ""),
    area: String(formData.get("area") || ""),
    notes: String(formData.get("notes") || ""),
    items,
  });

  if (!result.success) {
    return {
      success: false,
      message: "Please correct the errors below.",
      fieldErrors: result.fieldErrors,
    };
  }

  // The browser will save this order in localStorage.
  // No server-side persistence occurs here.
  return {
    success: true,
    message: "Order validated successfully.",
    order: {
      ...result.order,
      id: crypto.randomUUID(),
      status: "pending",
      createdAt: new Date().toISOString(),
    },
  };
}

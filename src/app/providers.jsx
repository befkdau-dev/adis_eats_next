"use client";

import { CartProvider } from "@/app/context/CartProvider";

export default function Providers({ children }) {
  return <CartProvider>{children}</CartProvider>;
}

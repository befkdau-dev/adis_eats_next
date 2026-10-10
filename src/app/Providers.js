"use client";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrdersProvider } from "./context/OrdersContext";
import LoginModal from "./components/LoginModal";

export default function Providers({ children, initialUser }) {
  return (
    <AuthProvider initialUser={initialUser}>
      <OrdersProvider>
        <CartProvider>
          {children}
          <LoginModal />
        </CartProvider>
      </OrdersProvider>
    </AuthProvider>
  );
}

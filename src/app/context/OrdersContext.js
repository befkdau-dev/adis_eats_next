// app/context/OrdersContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";

const OrdersContext = createContext(undefined);
const KEY = "orderIds";

export function OrdersProvider({ children }) {
  const [orderIds, setOrderIds] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setOrderIds(JSON.parse(stored));
    } catch (err) {
      console.error("Failed to load order ids:", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(orderIds));
    } catch (err) {
      console.error("Failed to save order ids:", err);
    }
  }, [orderIds, isLoaded]);

  const addOrderId = (id) => setOrderIds((prev) => [id, ...prev]); // newest first

  return (
    <OrdersContext.Provider value={{ orderIds, isLoaded, addOrderId }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}

"use client";
import { createContext, useContext, useEffect, useState } from "react";

export const CartContext = createContext(null);
const CART_KEY = "cart";
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load cart from stroage", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);
  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (err) {
      console.error("Failed to save to cart", err);
    }
  }, [items, isLoaded]);
  const addItem = (dish) => {
    setItems((prev) => {
      const exsisitingDish = items.find((item) => item.id === dish.id);
      if (exsisitingDish) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  };
  const removeItem = (id) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };
  const clearCart = () => {
    setItems([]);
  };

  const totalPrice = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );
  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, totalPrice, isLoaded }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  const cxt = useContext(CartContext);
  if (!cxt) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return cxt;
}

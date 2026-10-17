"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);
const CART_KEY = "cart";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Read the saved cart after the component mounts in the browser.
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_KEY);
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];

      setCart(
        Array.isArray(parsedCart)
          ? parsedCart.filter(
              (item) =>
                Number.isInteger(Number(item.id)) && Number(item.quantity) > 0,
            )
          : [],
      );
    } catch {
      setCart([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Persist cart changes only after the initial load.
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Unable to save cart:", error);
    }
  }, [cart, isLoaded]);

  const addToCart = useCallback((dish) => {
    if (!dish?.isAvailable) return;

    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => Number(item.id) === Number(dish.id),
      );

      if (existing) {
        if (existing.quantity >= 50) return currentCart;

        return currentCart.map((item) =>
          Number(item.id) === Number(dish.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...currentCart,
        {
          id: Number(dish.id),
          name: dish.name,
          price: Number(dish.price),
          image: dish.image,
          quantity: 1,
        },
      ];
    });
  }, []);

  const increaseQuantity = useCallback((id) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        Number(item.id) === Number(id) && item.quantity < 50
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }, []);

  const decreaseQuantity = useCallback((id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          Number(item.id) === Number(id)
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => Number(item.id) !== Number(id)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const value = useMemo(
    () => ({
      cart,
      isLoaded,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [
      cart,
      isLoaded,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,
      totalItems,
      totalPrice,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}

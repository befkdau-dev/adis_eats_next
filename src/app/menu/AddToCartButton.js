"use client";
import { useCart } from "../context/CartContext";
export default function AddToCartButton({ dish }) {
  const { addItem } = useCart();
  return (
    <button
      onClick={() => addItem(dish)}
      disabled={!dish.isAvailable}
      className={
        dish.isAvailable
          ? "text-xs bg-orange-600 text-white px-3 py-1.5 rounded hover:bg-orange-700 transition"
          : "text-xs bg-gray-300 text-gray-500 px-3 py-1.5 rounded cursor-not-allowed"
      }
    >
      {dish.isAvailable ? "Add to Cart" : "Unavailable"}
    </button>
  );
}

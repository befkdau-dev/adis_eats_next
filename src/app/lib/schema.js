import { z } from "zod";

export const orderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters.")
    .max(100, "Name is too long."),

  phone: z
    .string()
    .trim()
    .regex(/^\+2519\d{8}$/, "Use the format +2519XXXXXXXX."),

  area: z
    .string()
    .trim()
    .min(2, "Enter your delivery area.")
    .max(100, "Delivery area is too long."),

  notes: z
    .string()
    .trim()
    .max(500, "Notes cannot exceed 500 characters.")
    .default(""),

  items: z
    .array(
      z.object({
        id: z.union([z.string(), z.number()]),
        quantity: z
          .number()
          .int("Quantity must be a whole number.")
          .min(1, "Quantity must be at least 1.")
          .max(50, "Quantity cannot exceed 50."),
      }),
    )
    .min(1, "Your cart is empty.")
    .max(50, "Too many different items in the cart."),
});

export function getFieldErrors(error) {
  return error.flatten().fieldErrors;
}

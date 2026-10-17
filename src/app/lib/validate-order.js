import { orderSchema, getFieldErrors } from "@/app/lib/schema";
import { getDish } from "@/app/lib/menu";

export function validateOrder(input) {
  const result = orderSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      fieldErrors: getFieldErrors(result.error),
    };
  }

  const items = [];
  const itemErrors = {};

  for (const item of result.data.items) {
    const dish = getDish(item.id);

    if (!dish) {
      itemErrors.items = [`Dish with ID "${item.id}" does not exist.`];
      break;
    }

    if (!dish.isAvailable) {
      itemErrors.items = [`${dish.name} is currently unavailable.`];
      break;
    }

    items.push({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: item.quantity,
      subtotal: dish.price * item.quantity,
    });
  }

  if (Object.keys(itemErrors).length > 0) {
    return {
      success: false,
      fieldErrors: itemErrors,
    };
  }

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  return {
    success: true,
    order: {
      name: result.data.name,
      phone: result.data.phone,
      area: result.data.area,
      notes: result.data.notes,
      items,
      total,
    },
  };
}

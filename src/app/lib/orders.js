import { getMenu } from "./dishes";
import { validateCustomer } from "./validateOrder";

export async function buildOrder({ customer, items, userId }) {
  const { values, errors } = validateCustomer(customer);

  const rawItems = Array.isArray(items) ? items : [];
  const menu = await getMenu();
  const lines = [];

  if (rawItems.length === 0) errors.items = "Your cart is empty";

  for (const entry of rawItems) {
    const id = Number(entry?.id);
    const quantity = Number(entry?.quantity);

    if (
      !Number.isInteger(id) ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 20
    ) {
      errors.items = "Cart contains an invalid item";
      break;
    }

    const dish = menu.find((d) => d.id === id);
    if (!dish) {
      errors.items = "A dish in your cart no longer exists";
      break;
    }
    if (!dish.isAvailable) {
      errors.items = `${dish.name} is currently unavailable`;
      break;
    }

    lines.push({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity,
      subtotal: dish.price * quantity,
    });
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const order = {
    id: `ORD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    customer: values,
    usrId: userId,
    items: lines,
    total: lines.reduce((sum, l) => sum + l.subtotal, 0),
    status: "received",
    createdAt: new Date().toISOString(),
  };

  return { order };
}

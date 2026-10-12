import menuData from "@/app/data/menu.json";

export async function getMenu() {
  return menuData.menu;
}

export async function getDishBySlug(slug) {
  const menu = await getMenu();
  return menu.find((dish) => dish.slug === slug) ?? null;
}

// Kept for anywhere that still needs a numeric lookup (e.g. order/cart validation)
export async function getDishById(id) {
  const menu = await getMenu();
  return menu.find((dish) => dish.id === Number(id)) ?? null;
}

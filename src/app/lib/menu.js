import menuData from "@/app/data/menu.json";

export function getMenu() {
  return menuData.menu;
}

export function getAvailableMenu() {
  return menuData.menu.filter((dish) => dish.isAvailable);
}

export function getDish(id) {
  return menuData.menu.find((dish) => String(dish.id) === String(id));
}

export function getDishBySlug(slug) {
  return menuData.menu.find((dish) => dish.slug === slug);
}

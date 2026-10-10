import menuData from "@/app/data/menu.json";

export async function getDish(id) {
  const dishes = menuData.menu;
  return dishes.find((item) => item.id === Number(id) ?? null);
}

export async function getMenu() {
  return menuData.menu;
}

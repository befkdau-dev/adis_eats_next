"use client";

import menuData from "@/app/data/menu.json";

const MENU_KEY = "menu";
const MENU_EVENT = "menuUpdated";

export function getLocalMenu() {
  if (typeof window === "undefined") return [];

  const savedMenu = localStorage.getItem(MENU_KEY);

  if (savedMenu === null) {
    const initialMenu = Array.isArray(menuData.menu) ? menuData.menu : [];

    localStorage.setItem(MENU_KEY, JSON.stringify(initialMenu));
    return initialMenu;
  }

  const parsed = JSON.parse(savedMenu);

  if (!Array.isArray(parsed)) {
    throw new Error("Saved menu data must be an array.");
  }

  return parsed;
}

export function saveLocalMenu(menu) {
  if (typeof window === "undefined") {
    throw new Error("Menu storage is only available in the browser.");
  }

  if (!Array.isArray(menu)) {
    throw new Error("Menu must be an array.");
  }

  localStorage.setItem(MENU_KEY, JSON.stringify(menu));
  window.dispatchEvent(new Event(MENU_EVENT));
}

export function getMenuEventName() {
  return MENU_EVENT;
}

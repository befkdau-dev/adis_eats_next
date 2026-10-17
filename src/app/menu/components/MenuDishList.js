import { getMenu } from "@/app/lib/menu";
import DishList from "./DishList";

export default function MenuDishList() {
  const dishes = getMenu();

  return <DishList dishes={dishes} />;
}

import { useCartStore } from "../store/cartStore";

export function useCartCount() {
  const items = useCartStore((state) => state.items);

  return items.reduce((sum, item) => sum + item.quantity, 0);
}

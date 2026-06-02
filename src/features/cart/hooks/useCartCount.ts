import { useAuth } from "../../auth/hooks/useAuth";
import { useDbCart } from "./useDbCart";
import { useCartStore } from "../store/cartStore";

export function useCartCount() {
  const { user, isLoggedIn } = useAuth();

  const localItems = useCartStore((state) => state.items);
  const { dbItems } = useDbCart(user);

  const localCartCount = localItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const dbCartCount = dbItems.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  return isLoggedIn && user ? dbCartCount : localCartCount;
}

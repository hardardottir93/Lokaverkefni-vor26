import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../auth/hooks/useAuth";
import { getCartItemsForUser } from "../api/cartApi";
import { useCartStore } from "../store/cartStore";

export function useCartCount() {
  const { user, isLoggedIn } = useAuth();
  const localItems = useCartStore((state) => state.items);

  const localCount = localItems.reduce((sum, item) => sum + item.quantity, 0);

  const { data: dbItems = [] } = useQuery({
    queryKey: ["db-cart", user?.id],
    queryFn: () => {
      if (!user) return Promise.resolve([]);
      return getCartItemsForUser(user);
    },
    enabled: Boolean(isLoggedIn && user),
  });

  const dbCount = dbItems.reduce((sum, item) => sum + item.quantity, 0);

  return isLoggedIn ? dbCount : localCount;
}

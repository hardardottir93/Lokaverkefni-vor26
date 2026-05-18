import { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { getCartItemsForUser } from "../api/cartApi";
import { useCartStore } from "../store/cartStore";

export function useCartCount() {
  const { user, isLoggedIn } = useAuth();
  const localItems = useCartStore((state) => state.items);
  const [dbCartCount, setDbCartCount] = useState(0);

  const localCartCount = localItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  async function loadDbCartCount() {
    if (!user) {
      setDbCartCount(0);
      return;
    }

    const items = await getCartItemsForUser(user);

    const count = items.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);

    setDbCartCount(count);
  }

  useEffect(() => {
    if (isLoggedIn && user) {
      loadDbCartCount();
    } else {
      setDbCartCount(0);
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    function handleCartUpdated() {
      if (isLoggedIn && user) {
        loadDbCartCount();
      }
    }

    window.addEventListener("cart-updated", handleCartUpdated);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdated);
    };
  }, [isLoggedIn, user]);

  return isLoggedIn ? dbCartCount : localCartCount;
}

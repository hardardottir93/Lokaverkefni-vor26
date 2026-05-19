import { useEffect, useRef } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { syncUserCart } from "../api/cartSyncApi";
import { useCartStore } from "../store/cartStore";

export function useSyncCartOnLogin() {
  const { user, isLoggedIn } = useAuth();
  const hasSynced = useRef(false);
  const wasLoggedIn = useRef(isLoggedIn);

  useEffect(() => {
    async function syncCart() {
      const userJustLoggedIn = !wasLoggedIn.current && isLoggedIn;

      wasLoggedIn.current = isLoggedIn;

      if (!userJustLoggedIn || !user || hasSynced.current) {
        return;
      }

      const items = useCartStore.getState().items;

      if (items.length === 0) {
        return;
      }

      try {
        hasSynced.current = true;

        await syncUserCart({
          user,
          items,
        });

        useCartStore.getState().clearCart();
        window.dispatchEvent(new Event("cart-updated"));
      } catch (error) {
        hasSynced.current = false;
        console.error("SYNC ERROR", error);
      }
    }

    syncCart();
  }, [isLoggedIn, user]);
}

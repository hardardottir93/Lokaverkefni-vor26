import { useEffect, useRef } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { syncUserCart } from "../api/cartSyncApi";
import { useCartStore } from "../store/cartStore";

export function useSyncCartOnLogin() {
  const { user, isLoggedIn } = useAuth();
  const hasSynced = useRef(false);

  useEffect(() => {
    async function syncCart() {
      const items = useCartStore.getState().items;

      console.log("SYNC CHECK", {
        isLoggedIn,
        userEmail: user?.email,
        itemCount: items.length,
        hasSynced: hasSynced.current,
        items,
      });

      if (!isLoggedIn || !user || items.length === 0 || hasSynced.current) {
        return;
      }

      try {
        hasSynced.current = true;

        const result = await syncUserCart({
          user,
          items,
        });

        console.log("SYNC SUCCESS", result);

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

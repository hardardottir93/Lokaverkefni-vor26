import { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { syncUserCart } from "../api/cartSyncApi";
import { useCartStore, type CartItem } from "../store/cartStore";

export function useAddToCart() {
  const { user, isLoggedIn } = useAuth();
  const addToCart = useCartStore((state) => state.addToCart);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  async function handleAddToCart(item: CartItem) {
    if (!isLoggedIn || !user) {
      addToCart(item.product, item.quantity);
      return;
    }

    setIsAddingToCart(true);

    try {
      await syncUserCart({
        user,
        items: [item],
      });

      window.dispatchEvent(new Event("cart-updated"));
    } finally {
      setIsAddingToCart(false);
    }
  }

  return {
    addToCart: handleAddToCart,
    isAddingToCart,
  };
}

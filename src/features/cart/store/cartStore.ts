import { create } from "zustand";
import type { Product } from "../../products/model/product";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string | number) => void;
  increaseQuantity: (productId: string | number) => void;
  decreaseQuantity: (productId: string | number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  items: [],

  addToCart: (product, quantity = 1) =>
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        };
      }

      return {
        items: [...state.items, { product, quantity }],
      };
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),

  increaseQuantity: (productId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    })),

  decreaseQuantity: (productId) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    })),

  clearCart: () => set({ items: [] }),
}));

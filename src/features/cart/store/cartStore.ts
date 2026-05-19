import { create } from "zustand";
import { persist } from "zustand/middleware";
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

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addToCart: (product, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id,
          );

          const stock = product.stock;

          if (stock <= 0) {
            return state;
          }

          if (existingItem) {
            const nextQuantity = Math.min(
              existingItem.quantity + quantity,
              stock,
            );

            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: nextQuantity }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                product,
                quantity: Math.min(quantity, stock),
              },
            ],
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
    }),
    {
      name: "cart-storage",
    },
  ),
);

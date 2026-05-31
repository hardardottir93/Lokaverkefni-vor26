import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductVariant } from "../../products/model/product";

export type CartItem = {
  product: Product;
  quantity: number;
  variant?: ProductVariant | null;
};

type CartStore = {
  items: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    variant?: ProductVariant | null,
  ) => void;
  removeFromCart: (
    productId: string | number,
    variantId?: string | null,
  ) => void;
  increaseQuantity: (
    productId: string | number,
    variantId?: string | null,
  ) => void;
  decreaseQuantity: (
    productId: string | number,
    variantId?: string | null,
  ) => void;
  clearCart: () => void;
};

function isSameCartItem(
  item: CartItem,
  productId: string | number,
  variantId?: string | null,
) {
  return (
    item.product.id === productId &&
    (item.variant?.id ?? null) === (variantId ?? null)
  );
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addToCart: (product, quantity = 1, variant = null) =>
        set((state) => {
          const stock = variant?.stock ?? product.stock;

          if (stock <= 0) {
            return state;
          }

          const existingItem = state.items.find((item) =>
            isSameCartItem(item, product.id, variant?.id ?? null),
          );

          if (existingItem) {
            const nextQuantity = Math.min(
              existingItem.quantity + quantity,
              stock,
            );

            return {
              items: state.items.map((item) =>
                isSameCartItem(item, product.id, variant?.id ?? null)
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
                variant,
                quantity: Math.min(quantity, stock),
              },
            ],
          };
        }),

      removeFromCart: (productId, variantId = null) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !isSameCartItem(item, productId, variantId),
          ),
        })),

      increaseQuantity: (productId, variantId = null) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (!isSameCartItem(item, productId, variantId)) {
              return item;
            }

            const stock = item.variant?.stock ?? item.product.stock;

            return {
              ...item,
              quantity: Math.min(item.quantity + 1, stock),
            };
          }),
        })),

      decreaseQuantity: (productId, variantId = null) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              isSameCartItem(item, productId, variantId)
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

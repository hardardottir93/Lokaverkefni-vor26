import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "./cartStore";
import type { Product } from "../../products/model/product";

const mockProduct: Product = {
  id: 1,
  name: "Drops Karisma",
  description: "Mjúkt ullargarn",
  price: 590,
  image_url: "https://example.com/image.jpg",
  stock: 10,
  category_id: 1,
  categories: {
    id: 1,
    name: "Garn",
    slug: "garn",
  },
  created_at: "",
};

const secondMockProduct: Product = {
  id: 2,
  name: "Prjónar nr. 4",
  description: "Góðir prjónar",
  price: 890,
  image_url: null,
  stock: 5,
  category_id: 2,
  categories: {
    id: 2,
    name: "Prjónar",
    slug: "prjonar",
  },
  created_at: "",
};

describe("cartStore", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it("adds a product to the cart", () => {
    useCartStore.getState().addToCart(mockProduct);

    const { items } = useCartStore.getState();

    expect(items).toHaveLength(1);
    expect(items[0].product.id).toBe(mockProduct.id);
    expect(items[0].quantity).toBe(1);
  });

  it("increases quantity when the same product is added again", () => {
    useCartStore.getState().addToCart(mockProduct);
    useCartStore.getState().addToCart(mockProduct);

    const { items } = useCartStore.getState();

    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it("adds product with selected quantity", () => {
    useCartStore.getState().addToCart(mockProduct, 3);

    const { items } = useCartStore.getState();

    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
  });

  it("removes a product from the cart", () => {
    useCartStore.getState().addToCart(mockProduct);
    useCartStore.getState().addToCart(secondMockProduct);

    useCartStore.getState().removeFromCart(mockProduct.id);

    const { items } = useCartStore.getState();

    expect(items).toHaveLength(1);
    expect(items[0].product.id).toBe(secondMockProduct.id);
  });

  it("increases and decreases product quantity", () => {
    useCartStore.getState().addToCart(mockProduct);

    useCartStore.getState().increaseQuantity(mockProduct.id);
    expect(useCartStore.getState().items[0].quantity).toBe(2);

    useCartStore.getState().decreaseQuantity(mockProduct.id);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it("removes product when quantity is decreased to zero", () => {
    useCartStore.getState().addToCart(mockProduct);

    useCartStore.getState().decreaseQuantity(mockProduct.id);

    const { items } = useCartStore.getState();

    expect(items).toHaveLength(0);
  });

  it("clears the cart", () => {
    useCartStore.getState().addToCart(mockProduct);
    useCartStore.getState().addToCart(secondMockProduct);

    useCartStore.getState().clearCart();

    expect(useCartStore.getState().items).toHaveLength(0);
  });
});

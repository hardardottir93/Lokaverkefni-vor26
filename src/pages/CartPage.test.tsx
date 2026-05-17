import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { CartPage } from "./CartPage";
import { useCartStore } from "../features/cart/store/cartStore";
import type { Product } from "../features/products/model/product";

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

function renderCartPage() {
  return render(
    <MemoryRouter>
      <CartPage />
    </MemoryRouter>,
  );
}

describe("CartPage", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    localStorage.clear();
  });

  it("shows empty cart message when cart is empty", () => {
    renderCartPage();

    expect(screen.getByText("Karfan þín er tóm.")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /skoða vörur/i }),
    ).toBeInTheDocument();
  });

  it("renders product in cart", () => {
    useCartStore.getState().addToCart(mockProduct, 2);

    renderCartPage();

    expect(screen.getByText("Drops Karisma")).toBeInTheDocument();
    expect(screen.getByText("590 kr.")).toBeInTheDocument();
    expect(screen.getAllByText("2")).toHaveLength(2);
    expect(screen.getAllByText("1.180 kr.")).toHaveLength(2);
  });
  it("increases product quantity", async () => {
    const user = userEvent.setup();

    useCartStore.getState().addToCart(mockProduct);

    renderCartPage();

    await user.click(screen.getByRole("button", { name: "+" }));

    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it("decreases product quantity", async () => {
    const user = userEvent.setup();

    useCartStore.getState().addToCart(mockProduct, 2);

    renderCartPage();

    await user.click(screen.getByRole("button", { name: "-" }));

    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it("removes product from cart", async () => {
    const user = userEvent.setup();

    useCartStore.getState().addToCart(mockProduct);

    renderCartPage();

    await user.click(screen.getByRole("button", { name: /fjarlægja/i }));

    expect(useCartStore.getState().items).toHaveLength(0);
    expect(screen.getByText("Karfan þín er tóm.")).toBeInTheDocument();
  });
});

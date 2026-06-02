import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCartStore } from "../features/cart/store/cartStore";
import type { Product } from "../features/products/model/product";
import { CartPage } from "./CartPage";

vi.mock("../features/auth/hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    isLoggedIn: false,
  }),
}));

vi.mock("../features/cart/hooks/useDbCart", () => ({
  useDbCart: () => ({
    dbItems: [],
    isLoading: false,
    errorMessage: "",
  }),
}));

const testProduct: Product = {
  id: 1,
  created_at: "2026-01-01",
  name: "Sandnes Garn Ballerina Chunky Mohair",
  description: "Mjúkt garn",
  price: 2489,
  category_id: 1,
  image_url: null,
  stock: 10,
  categories: {
    id: 1,
    name: "Garn",
    slug: "garn",
  },
  product_variants: [],
};

function renderCartPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("CartPage", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it("shows empty cart message when cart is empty", () => {
    renderCartPage();

    expect(screen.getByText("Karfan þín er tóm.")).toBeInTheDocument();
  });

  it("renders product in cart", () => {
    useCartStore.getState().addToCart(testProduct);

    renderCartPage();

    const productTitle = screen.getByText(
      "Sandnes Garn Ballerina Chunky Mohair",
    );

    const productCard = productTitle.closest("article");

    expect(productCard).not.toBeNull();

    expect(
      within(productCard as HTMLElement).getAllByText(/2\.489\s+kr\./),
    ).toHaveLength(2);
  });

  it("increases product quantity", async () => {
    const user = userEvent.setup();

    useCartStore.getState().addToCart(testProduct);

    renderCartPage();

    const increaseButton = screen.getByRole("button", { name: "+" });

    await user.click(increaseButton);

    const productTitle = screen.getByText(
      "Sandnes Garn Ballerina Chunky Mohair",
    );

    const productCard = productTitle.closest("article");

    expect(productCard).not.toBeNull();

    expect(
      within(productCard as HTMLElement).getByText("2"),
    ).toBeInTheDocument();

    expect(
      within(productCard as HTMLElement).getByText(/4\.978\s+kr\./),
    ).toBeInTheDocument();
  });

  it("decreases product quantity", async () => {
    const user = userEvent.setup();

    useCartStore.getState().addToCart(testProduct, 2);

    renderCartPage();

    const decreaseButton = screen.getByRole("button", { name: "-" });

    await user.click(decreaseButton);

    const productTitle = screen.getByText(
      "Sandnes Garn Ballerina Chunky Mohair",
    );

    const productCard = productTitle.closest("article");

    expect(productCard).not.toBeNull();

    expect(
      within(productCard as HTMLElement).getByText("1"),
    ).toBeInTheDocument();

    expect(
      within(productCard as HTMLElement).getAllByText(/2\.489\s+kr\./),
    ).toHaveLength(2);
  });

  it("removes product from cart", async () => {
    const user = userEvent.setup();

    useCartStore.getState().addToCart(testProduct);

    renderCartPage();

    const removeButton = screen.getByRole("button", { name: "Fjarlægja" });

    await user.click(removeButton);

    expect(screen.getByText("Karfan þín er tóm.")).toBeInTheDocument();

    expect(
      screen.queryByText("Sandnes Garn Ballerina Chunky Mohair"),
    ).not.toBeInTheDocument();
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProductDetailPage } from "./ProductDetailPage";
import { useProduct } from "../features/products/hooks/useProduct";
import { useCartStore } from "../features/cart/store/cartStore";
import type { Product } from "../features/products/model/product";

vi.mock("../features/products/hooks/useProduct", () => ({
  useProduct: vi.fn(),
}));

const mockProduct: Product = {
  id: 1,
  name: "Drops Karisma",
  description: "Mjúkt ullargarn",
  price: 590,
  image_url: "https://example.com/karisma.jpg",
  stock: 10,
  category_id: 1,
  created_at: "2026-01-01T00:00:00.000Z",
  categories: {
    id: 1,
    name: "Garn",
    slug: "garn",
  },
};

function renderProductDetailPage() {
  return render(
    <MemoryRouter initialEntries={["/products/1"]}>
      <Routes>
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProductDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCartStore.getState().clearCart();
    localStorage.clear();
  });

  it("shows loading state", () => {
    vi.mocked(useProduct).mockReturnValue({
      product: null,
      isLoading: true,
      errorMessage: "",
    });

    renderProductDetailPage();

    expect(screen.getByText("Sæki vöru...")).toBeInTheDocument();
  });

  it("shows error message", () => {
    vi.mocked(useProduct).mockReturnValue({
      product: null,
      isLoading: false,
      errorMessage: "Ekki tókst að sækja vöruna.",
    });

    renderProductDetailPage();

    expect(screen.getByText("Ekki tókst að sækja vöruna.")).toBeInTheDocument();
  });

  it("renders product details", () => {
    vi.mocked(useProduct).mockReturnValue({
      product: mockProduct,
      isLoading: false,
      errorMessage: "",
    });

    renderProductDetailPage();

    expect(screen.getByText("Drops Karisma")).toBeInTheDocument();
    expect(screen.getByText("590 kr.")).toBeInTheDocument();
    expect(screen.getByText("10 á lager")).toBeInTheDocument();
    expect(screen.getByText("Mjúkt ullargarn")).toBeInTheDocument();
    expect(screen.getByText("Garn")).toBeInTheDocument();
  });

  it("increases and decreases quantity", async () => {
    const user = userEvent.setup();

    vi.mocked(useProduct).mockReturnValue({
      product: mockProduct,
      isLoading: false,
      errorMessage: "",
    });

    renderProductDetailPage();

    expect(screen.getByText("1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "+" }));
    expect(screen.getByText("2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "-" }));
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("adds selected quantity to cart", async () => {
    const user = userEvent.setup();

    vi.mocked(useProduct).mockReturnValue({
      product: mockProduct,
      isLoading: false,
      errorMessage: "",
    });

    renderProductDetailPage();

    await user.click(screen.getByRole("button", { name: "+" }));
    await user.click(screen.getByRole("button", { name: "+" }));
    await user.click(screen.getByRole("button", { name: /bæta í körfu/i }));

    const { items } = useCartStore.getState();

    expect(items).toHaveLength(1);
    expect(items[0].product.id).toBe(mockProduct.id);
    expect(items[0].quantity).toBe(3);
  });

  it("disables add to cart button when product is out of stock", () => {
    vi.mocked(useProduct).mockReturnValue({
      product: {
        ...mockProduct,
        stock: 0,
      },
      isLoading: false,
      errorMessage: "",
    });

    renderProductDetailPage();

    expect(screen.getByRole("button", { name: /uppselt/i })).toBeDisabled();
  });
});

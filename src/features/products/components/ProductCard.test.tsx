import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ProductCard } from "./ProductCard";
import { useCartStore } from "../../cart/store/cartStore";
import type { Product } from "../model/product";

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

const outOfStockProduct: Product = {
  ...mockProduct,
  id: 2,
  name: "Uppselt garn",
  stock: 0,
};

function renderProductCard(product: Product) {
  return render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>,
  );
}

describe("ProductCard", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    localStorage.clear();
  });

  it("renders product information", () => {
    renderProductCard(mockProduct);

    expect(screen.getByText("Drops Karisma")).toBeInTheDocument();
    expect(screen.getByText("Mjúkt ullargarn")).toBeInTheDocument();
    expect(screen.getByText("590 kr.")).toBeInTheDocument();
    expect(screen.getByText("10 á lager")).toBeInTheDocument();
    expect(screen.getByText("Garn")).toBeInTheDocument();
  });

  it("adds product to cart when add to cart button is clicked", async () => {
    const user = userEvent.setup();

    renderProductCard(mockProduct);

    await user.click(screen.getByRole("button", { name: /bæta í körfu/i }));

    const { items } = useCartStore.getState();

    expect(items).toHaveLength(1);
    expect(items[0].product.id).toBe(mockProduct.id);
    expect(items[0].quantity).toBe(1);
  });

  it("disables add to cart button when product is out of stock", () => {
    renderProductCard(outOfStockProduct);

    expect(
      screen.getByRole("button", { name: /bæta í körfu/i }),
    ).toBeDisabled();
    expect(screen.getByText("Uppselt")).toBeInTheDocument();
  });
});

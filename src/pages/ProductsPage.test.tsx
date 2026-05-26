import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProductsPage } from "./ProductsPage";

vi.mock("../features/products/api/productsApi", () => ({
  getProducts: vi.fn(),
}));

vi.mock("../features/products/api/categoriesApi", () => ({
  getCategories: vi.fn(),
}));

vi.mock("../features/cart/hooks/useAddToCart", () => ({
  useAddToCart: () => ({
    addToCart: vi.fn(),
    isAddingToCart: false,
  }),
}));

import { getProducts } from "../features/products/api/productsApi";
import { getCategories } from "../features/products/api/categoriesApi";

const mockProducts = [
  {
    id: 1,
    name: "Merino garn",
    slug: "merino-garn",
    description: "Mjúkt garn",
    price: 1490,
    price_cents: 149000,
    currency: "ISK",
    stock: 10,
    stock_quantity: 10,
    image_url: null,
    created_at: "2026-01-01",
    category_id: 1,
    categories: {
      id: 1,
      name: "Garn",
      slug: "garn",
      created_at: "2026-01-01",
    },
  },
  {
    id: 2,
    name: "Hringprjónar",
    slug: "hringprjonar",
    description: "Góðir prjónar",
    price: 1290,
    price_cents: 129000,
    currency: "ISK",
    stock: 5,
    stock_quantity: 5,
    image_url: null,
    created_at: "2026-01-02",
    category_id: 2,
    categories: {
      id: 2,
      name: "Prjónar",
      slug: "prjonar",
      created_at: "2026-01-01",
    },
  },
];

const mockCategories = [
  {
    id: 1,
    name: "Garn",
    slug: "garn",
    created_at: "2026-01-01",
  },
  {
    id: 2,
    name: "Prjónar",
    slug: "prjonar",
    created_at: "2026-01-01",
  },
];

describe("ProductsPage", () => {
  beforeEach(() => {
    vi.mocked(getProducts).mockResolvedValue(mockProducts);
    vi.mocked(getCategories).mockResolvedValue(mockCategories);
  });

  it("filters products by selected category", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ProductsPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Merino garn")).toBeInTheDocument();
    expect(screen.getByText("Hringprjónar")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /sía vörur/i }));

    await user.click(screen.getByRole("checkbox", { name: /garn/i }));

    await waitFor(() => {
      expect(screen.getByText("Merino garn")).toBeInTheDocument();
      expect(screen.queryByText("Hringprjónar")).not.toBeInTheDocument();
    });
  });
});

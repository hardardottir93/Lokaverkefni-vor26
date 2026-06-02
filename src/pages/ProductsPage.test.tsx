import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { ProductsPage } from "./ProductsPage";

const useProductsMock = vi.fn();

vi.mock("../features/products/hooks/useProducts", () => ({
  useProducts: (categorySlug?: string) => useProductsMock(categorySlug),
}));

vi.mock("../features/products/hooks/useCategories", () => ({
  useCategories: () => ({
    categories: [
      { id: 1, name: "Garn", slug: "garn" },
      { id: 2, name: "Prjónar", slug: "prjonar" },
    ],
    isLoading: false,
    errorMessage: "",
  }),
}));

describe("ProductsPage", () => {
  it("reads category from the URL and sends it to useProducts", () => {
    useProductsMock.mockReturnValue({
      products: [
        {
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
        },
      ],
      isLoading: false,
      errorMessage: "",
    });

    render(
      <MemoryRouter initialEntries={["/products?category=garn"]}>
        <Routes>
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(useProductsMock).toHaveBeenCalledWith("garn");
    expect(
      screen.getByText("Sandnes Garn Ballerina Chunky Mohair"),
    ).toBeInTheDocument();
  });
});

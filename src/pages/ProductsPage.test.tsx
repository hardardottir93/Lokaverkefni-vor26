import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProductsPage } from "./ProductsPage";
import { getCategories } from "../features/products/api/categoriesApi";
import { getProducts } from "../features/products/api/productsApi";

vi.mock("../features/products/api/productsApi", () => ({
  getProducts: vi.fn(),
}));

vi.mock("../features/products/api/categoriesApi", () => ({
  getCategories: vi.fn(),
}));

const mockedGetProducts = vi.mocked(getProducts);
const mockedGetCategories = vi.mocked(getCategories);

function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

const mockCategories = [
  {
    id: "category-1",
    name: "Garn",
    slug: "garn",
  },
  {
    id: "category-2",
    name: "Prjónar",
    slug: "prjonar",
  },
];

const mockProducts = [
  {
    id: "product-1",
    name: "Merino garn",
    description: "Mjúkt garn",
    price: 1990,
    stock: 10,
    image_url: "",
    created_at: "2026-01-02T00:00:00.000Z",
    category_id: "category-1",
    categories: {
      id: "category-1",
      name: "Garn",
      slug: "garn",
    },
  },
  {
    id: "product-2",
    name: "Hringprjónar",
    description: "Góðir prjónar",
    price: 1290,
    stock: 5,
    image_url: "",
    created_at: "2026-01-01T00:00:00.000Z",
    category_id: "category-2",
    categories: {
      id: "category-2",
      name: "Prjónar",
      slug: "prjonar",
    },
  },
];

describe("ProductsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedGetProducts.mockResolvedValue(mockProducts as never);
    mockedGetCategories.mockResolvedValue(mockCategories as never);
  });

  it("filters products by selected category", async () => {
    const user = userEvent.setup();

    renderWithProviders(<ProductsPage />);

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

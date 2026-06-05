import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { getProducts } from "../features/products/api/productsApi";
import type { Product } from "../features/products/model/product";
import { SearchDropdown } from "./SearchDropdown";

vi.mock("../features/products/api/productsApi", () => ({
  getProducts: vi.fn(),
}));

const mockProducts: Product[] = [
  {
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
  },
  {
    id: 2,
    name: "Prjónar nr. 4",
    description: "Góðir prjónar",
    price: 890,
    image_url: null,
    stock: 5,
    category_id: 2,
    created_at: "2026-01-01T00:00:00.000Z",
    categories: {
      id: 2,
      name: "Prjónar",
      slug: "prjonar",
    },
  },
];

function renderSearchDropdown(onClose = vi.fn()) {
  return render(
    <MemoryRouter>
      <SearchDropdown onClose={onClose} />
    </MemoryRouter>,
  );
}

describe("SearchDropdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getProducts).mockResolvedValue(mockProducts);
  });

  it("renders search input", async () => {
    renderSearchDropdown();

    expect(await screen.findByPlaceholderText(/leita/i)).toBeInTheDocument();
  });

  it("shows matching products when user searches", async () => {
    const user = userEvent.setup();

    renderSearchDropdown();

    const input = await screen.findByPlaceholderText(/leita/i);

    await user.type(input, "karisma");

    expect(screen.getByText("Drops Karisma")).toBeInTheDocument();
    expect(screen.getByText("590 kr.")).toBeInTheDocument();
  });

  it("shows no results message when no products match", async () => {
    const user = userEvent.setup();

    renderSearchDropdown();

    const input = await screen.findByPlaceholderText(/leita/i);

    await user.type(input, "xyz");

    expect(screen.getByText("Engar vörur fundust.")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderSearchDropdown(onClose);

    await user.click(screen.getByRole("button", { name: /loka leit/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

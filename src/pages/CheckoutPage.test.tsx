import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CheckoutPage } from "./CheckoutPage";
import { useAuth } from "../features/auth/hooks/useAuth";
import { getCartItemsForUser } from "../features/cart/api/cartApi";
import { createOrderForUser } from "../features/orders/api/ordersApi";
import type { User } from "@supabase/supabase-js";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../features/auth/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../features/cart/api/cartApi", () => ({
  getCartItemsForUser: vi.fn(),
}));

vi.mock("../features/orders/api/ordersApi", () => ({
  createOrderForUser: vi.fn(),
}));

vi.mock("react-payment-inputs", () => ({
  usePaymentInputs: () => ({
    getCardNumberProps: () => ({
      name: "cardNumber",
      onChange: vi.fn(),
      onBlur: vi.fn(),
    }),
    getExpiryDateProps: () => ({
      name: "expiryDate",
      onChange: vi.fn(),
      onBlur: vi.fn(),
    }),
    getCVCProps: () => ({
      name: "cvc",
      onChange: vi.fn(),
      onBlur: vi.fn(),
    }),
    meta: {
      touchedInputs: {},
      erroredInputs: {},
    },
  }),
}));

const mockedUseAuth = vi.mocked(useAuth);
const mockedGetCartItemsForUser = vi.mocked(getCartItemsForUser);
const mockedCreateOrderForUser = vi.mocked(createOrderForUser);

const mockUser = {
  id: "user-1",
  email: "test@test.com",
  app_metadata: {},
  user_metadata: {
    full_name: "Test Notandi",
  },
  aud: "authenticated",
  created_at: "2026-01-01T00:00:00.000Z",
} as User;

const mockCartItems = [
  {
    id: "cart-item-1",
    quantity: 2,
    product: {
      id: "product-1",
      name: "Prjónagarn",
      price: 1990,
    },
  },
];

function renderCheckoutPage() {
  return render(
    <MemoryRouter>
      <CheckoutPage />
    </MemoryRouter>,
  );
}

describe("CheckoutPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseAuth.mockReturnValue({
      user: mockUser,
      isLoggedIn: true,
      isLoading: false,
    } as ReturnType<typeof useAuth>);

    mockedGetCartItemsForUser.mockResolvedValue(mockCartItems as never);
  });

  it("shows login message when user is not authenticated", async () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoggedIn: false,
      isLoading: false,
    } as ReturnType<typeof useAuth>);

    renderCheckoutPage();

    expect(
      screen.getByText(/þú þarft að skrá þig inn til að ganga frá pöntun/i),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /skrá inn/i })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("shows empty cart message when cart is empty", async () => {
    mockedGetCartItemsForUser.mockResolvedValue([]);

    renderCheckoutPage();

    expect(await screen.findByText(/karfan er tóm/i)).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /skoða vörur/i })).toHaveAttribute(
      "href",
      "/products",
    );
  });

  it("shows fake payment information when cart has items", async () => {
    renderCheckoutPage();

    expect(
      await screen.findByText(
        /þetta er gervigreiðsluferli\. engin raunveruleg greiðsla fer fram/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText(/gervigreiðsla/i)).toBeInTheDocument();
    expect(
      screen.getByText(/engar kortaupplýsingar eru vistaðar/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/prjónagarn/i)).toBeInTheDocument();
  });

  it("creates order and navigates to confirmation page after successful fake payment", async () => {
    const user = userEvent.setup();

    mockedCreateOrderForUser.mockResolvedValue({
      id: "order-123",
    } as never);

    renderCheckoutPage();

    await screen.findByText(/prjónagarn/i);

    await user.clear(screen.getByLabelText(/^nafn$/i));
    await user.type(screen.getByLabelText(/^nafn$/i), "Test Notandi");

    await user.type(screen.getByLabelText(/heimilisfang/i), "Testgata 1");
    await user.type(screen.getByLabelText(/póstnúmer/i), "101");
    await user.type(screen.getByLabelText(/bær/i), "Reykjavík");

    await user.type(screen.getByLabelText(/nafn á korti/i), "Test Notandi");
    await user.type(
      screen.getByPlaceholderText("4242 4242 4242 4242"),
      "4242424242424242",
    );
    await user.type(screen.getByPlaceholderText("12/30"), "1230");
    await user.type(screen.getByPlaceholderText("123"), "123");

    await user.click(
      screen.getByRole("button", { name: /staðfesta gervigreiðslu/i }),
    );

    await waitFor(() => {
      expect(mockedCreateOrderForUser).toHaveBeenCalledWith(mockUser);
    });

    expect(navigateMock).toHaveBeenCalledWith(
      "/order-confirmation?orderId=order-123",
    );
  });

  it("shows error message when order creation fails", async () => {
    const user = userEvent.setup();

    mockedCreateOrderForUser.mockRejectedValue(
      new Error("Ekki tókst að klára pöntun"),
    );

    renderCheckoutPage();

    await screen.findByText(/prjónagarn/i);

    await user.clear(screen.getByLabelText(/^nafn$/i));
    await user.type(screen.getByLabelText(/^nafn$/i), "Test Notandi");

    await user.type(screen.getByLabelText(/heimilisfang/i), "Testgata 1");
    await user.type(screen.getByLabelText(/póstnúmer/i), "101");
    await user.type(screen.getByLabelText(/bær/i), "Reykjavík");

    await user.type(screen.getByLabelText(/nafn á korti/i), "Test Notandi");
    await user.type(
      screen.getByPlaceholderText("4242 4242 4242 4242"),
      "4242424242424242",
    );
    await user.type(screen.getByPlaceholderText("12/30"), "1230");
    await user.type(screen.getByPlaceholderText("123"), "123");

    await user.click(
      screen.getByRole("button", { name: /staðfesta gervigreiðslu/i }),
    );

    expect(
      await screen.findByText(/ekki tókst að klára pöntun/i),
    ).toBeInTheDocument();
  });
});

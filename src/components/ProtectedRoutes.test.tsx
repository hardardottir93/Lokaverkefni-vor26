import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProtectedRoute } from "./ProtectedRoutes";
import { supabase } from "../lib/supabase";

vi.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
  },
}));

const mockedGetSession = vi.mocked(supabase.auth.getSession);

function renderProtectedRoute() {
  const router = createMemoryRouter(
    [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/profile",
            element: <p>Protected profile page</p>,
          },
        ],
      },
      {
        path: "/login",
        element: <p>Login page</p>,
      },
    ],
    {
      initialEntries: ["/profile"],
    },
  );

  return render(<RouterProvider router={router} />);
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to login when user is not authenticated", async () => {
    mockedGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    renderProtectedRoute();

    expect(screen.getByText(/hleð/i)).toBeInTheDocument();

    expect(await screen.findByText(/login page/i)).toBeInTheDocument();
  });

  it("renders protected page when user is authenticated", async () => {
    mockedGetSession.mockResolvedValue({
      data: {
        session: {
          access_token: "fake-token",
          token_type: "bearer",
          expires_in: 3600,
          refresh_token: "fake-refresh-token",
          user: {
            id: "user-1",
            email: "test@test.com",
          },
        },
      },
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.getSession>>);

    renderProtectedRoute();

    expect(
      await screen.findByText(/protected profile page/i),
    ).toBeInTheDocument();
  });
});

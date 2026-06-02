import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "../features/auth/api/authApi";
import { useAuth } from "../features/auth/hooks/useAuth";
import { getOrdersForUser } from "../features/orders/api/ordersApi";

type OrderItem = {
  id: string;
  product_name: string;
  variant_name: string | null;
  unit_price: number;
  quantity: number;
  line_total_cents: number;
};

type Order = {
  id: string;
  status: string;
  subtotal_cents: number;
  total_cents: number;
  currency: string;
  submitted_at: string;
  order_items: OrderItem[];
};

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadOrders() {
      if (!isLoggedIn || !user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await getOrdersForUser(user);
        setOrders(data as Order[]);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Ekki tókst að sækja pantanir",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [isLoggedIn, user]);

  async function handleLogout() {
    await signOut();
    navigate("/");
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-semibold text-stone-950">Mín síða</h1>
        <p className="mt-6 text-stone-600">Sæki pantanir...</p>
      </main>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-semibold text-stone-950">Mín síða</h1>

        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
          <p className="text-stone-600">
            Þú þarft að skrá þig inn til að sjá þína síðu.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            Skrá inn
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
            Aðgangur
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-stone-950">
            Mín síða
          </h1>

          <p className="mt-2 text-stone-600">{user.email}</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-fit rounded-full border border-stone-300 bg-white px-5 py-2 text-sm font-semibold text-stone-950 transition hover:border-stone-950"
        >
          Skrá út
        </button>
      </div>

      {errorMessage && (
        <p className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <section>
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-stone-950">
            Mínar pantanir
          </h2>

          <Link
            to="/products"
            className="text-sm font-semibold text-stone-600 underline hover:text-stone-950"
          >
            Halda áfram að versla
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
            <p className="text-stone-600">
              Þú hefur ekki klárað neina pöntun ennþá.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              Skoða vörur
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 border-b border-stone-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-stone-500">
                      Pöntun
                    </p>

                    <p className="mt-1 break-all text-sm text-stone-600">
                      #{order.id}
                    </p>

                    <p className="mt-2 text-sm text-stone-500">
                      {new Date(order.submitted_at).toLocaleDateString("is-IS")}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-sm font-medium text-stone-500">
                      Staða:{" "}
                      <span className="font-semibold text-stone-950">
                        {order.status}
                      </span>
                    </p>

                    <p className="mt-2 text-xl font-semibold text-stone-950">
                      {(order.total_cents / 100).toLocaleString("is-IS")} kr.
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <div>
                        <p className="font-medium text-stone-950">
                          {item.product_name}
                        </p>

                        <p className="mt-1 text-stone-500">
                          Magn: {item.quantity}
                        </p>
                      </div>

                      <p className="whitespace-nowrap font-semibold text-stone-950">
                        {(item.line_total_cents / 100).toLocaleString("is-IS")}{" "}
                        kr.
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

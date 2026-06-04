import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../features/auth/hooks/useAuth";
import { useOrders } from "../features/orders/hooks/useOrders";
import { signOut } from "../features/auth/api/authApi";

export function ProfilePage() {
  const { user } = useAuth();

  const { orders, isLoading, errorMessage } = useOrders(user);
  const navigate = useNavigate();

  const userName =
    user?.user_metadata.full_name ??
    user?.user_metadata.name ??
    user?.email ??
    "Notandi";

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-stone-950">
            Þú ert ekki innskráð/ur
          </h1>

          <p className="mt-3 text-stone-600">
            Skráðu þig inn til að sjá prófílinn þinn og pantanir.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            Fara í innskráningu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
              Minn prófíll
            </p>

            <h1 className="mt-2 text-3xl font-bold text-stone-950">
              {userName}
            </h1>

            {user.email && <p className="mt-2 text-stone-600">{user.email}</p>}
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full border border-stone-300 px-5 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
          >
            Skrá út
          </button>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
              Pantanir
            </p>

            <h2 className="mt-2 text-2xl font-bold text-stone-950">
              Mínar pantanir
            </h2>
          </div>

          <Link
            to="/products"
            className="text-sm font-medium text-stone-600 underline hover:text-stone-950"
          >
            Halda áfram að versla
          </Link>
        </div>

        {errorMessage && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
            <p className="text-stone-600">Sæki pantanir...</p>
          </div>
        ) : orders.length === 0 ? (
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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-stone-950">
                      Pöntun #{order.id}
                    </h3>

                    <p className="mt-1 text-sm text-stone-500">
                      Staða: {order.status}
                    </p>

                    {order.submitted_at && (
                      <p className="mt-1 text-sm text-stone-500">
                        Dagsetning:{" "}
                        {new Date(order.submitted_at).toLocaleDateString(
                          "is-IS",
                        )}
                      </p>
                    )}
                  </div>

                  <p className="font-semibold text-stone-950">
                    {order.total_cents.toLocaleString("is-IS")} kr.
                  </p>
                </div>

                {order.order_items.length > 0 && (
                  <div className="mt-5 border-t border-stone-200 pt-4">
                    <h4 className="text-sm font-semibold text-stone-950">
                      Vörur
                    </h4>

                    <ul className="mt-3 space-y-3">
                      {order.order_items.map((item) => (
                        <li
                          key={item.id}
                          className="flex flex-col gap-1 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="font-medium text-stone-800">
                              {item.product_name}
                            </p>

                            {item.variant_name && (
                              <p className="text-stone-500">
                                {item.variant_name}
                              </p>
                            )}

                            <p className="text-stone-500">
                              Magn: {item.quantity}
                            </p>
                          </div>

                          <p className="font-medium text-stone-950">
                            {item.line_total_cents.toLocaleString("is-IS")} kr.
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getOrderById } from "../features/orders/api/ordersApi";

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

export function OrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        setErrorMessage("Pöntun fannst ekki.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await getOrderById(orderId);
        setOrder(data as Order);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Ekki tókst að sækja pöntun",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-semibold text-stone-950">Staðfesting</h1>
        <p className="mt-6 text-stone-600">Sæki pöntun...</p>
      </main>
    );
  }

  if (errorMessage || !order) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-semibold text-stone-950">Staðfesting</h1>

        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-8 text-center">
          <p className="text-red-600">
            {errorMessage || "Pöntun fannst ekki."}
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            Skoða vörur
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <section className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">
            ✓
          </div>

          <h1 className="mt-5 text-3xl font-semibold text-stone-950">
            Takk fyrir pöntunina!
          </h1>

          <p className="mt-3 text-stone-600">
            Pöntunin þín hefur verið móttekin. Þetta var gervigreiðsla og engin
            raunveruleg greiðsla fór fram.
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-stone-50 p-5">
          <div className="grid gap-3 text-sm text-stone-700 sm:grid-cols-2">
            <div>
              <p className="font-medium text-stone-950">Pöntunarnúmer</p>
              <p className="mt-1 break-all">{order.id}</p>
            </div>

            <div>
              <p className="font-medium text-stone-950">Staða</p>
              <p className="mt-1 capitalize">{order.status}</p>
            </div>

            <div>
              <p className="font-medium text-stone-950">Dagsetning</p>
              <p className="mt-1">
                {new Date(order.submitted_at).toLocaleDateString("is-IS")}
              </p>
            </div>

            <div>
              <p className="font-medium text-stone-950">Samtals</p>
              <p className="mt-1">
                {(order.total_cents / 100).toLocaleString("is-IS")} kr.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-stone-950">
            Vörur í pöntun
          </h2>

          <div className="mt-4 divide-y divide-stone-200 rounded-2xl border border-stone-200">
            {order.order_items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 p-4"
              >
                <div>
                  <p className="font-medium text-stone-950">
                    {item.product_name}
                  </p>

                  {item.variant_name && (
                    <p className="mt-1 text-sm text-stone-500">
                      {item.variant_name}
                    </p>
                  )}

                  <p className="mt-1 text-sm text-stone-500">
                    Magn: {item.quantity}
                  </p>
                </div>

                <p className="whitespace-nowrap font-semibold text-stone-950">
                  {(item.line_total_cents / 100).toLocaleString("is-IS")} kr.
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/products"
            className="inline-flex justify-center rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-stone-50"
          >
            Halda áfram að versla
          </Link>

          <Link
            to="/"
            className="inline-flex justify-center rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            Fara á forsíðu
          </Link>
        </div>
      </section>
    </main>
  );
}

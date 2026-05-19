import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import {
  getCartItemsForUser,
  type SupabaseCartItem,
} from "../features/cart/api/cartApi";
import { createOrderForUser } from "../features/orders/api/ordersApi";
import { usePaymentInputs } from "react-payment-inputs";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [items, setItems] = useState<SupabaseCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");

  const {
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    getCardImageProps,
    meta,
  } = usePaymentInputs();

  useEffect(() => {
    async function loadCheckout() {
      if (!isLoggedIn || !user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const cartItems = await getCartItemsForUser(user);
        setItems(cartItems);

        setFullName(
          user.user_metadata.full_name ??
            user.user_metadata.name ??
            user.email ??
            "",
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Ekki tókst að sækja körfu",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadCheckout();
  }, [isLoggedIn, user]);

  const totalCents = items.reduce((sum, item) => {
    return sum + item.product.price_cents * item.quantity;
  }, 0);

  const totalQuantity = items.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    if (meta.erroredInputs.cardNumber) {
      setErrorMessage(meta.erroredInputs.cardNumber);
      setIsSubmitting(false);
      return;
    }

    if (meta.erroredInputs.expiryDate) {
      setErrorMessage(meta.erroredInputs.expiryDate);
      setIsSubmitting(false);
      return;
    }

    if (meta.erroredInputs.cvc) {
      setErrorMessage(meta.erroredInputs.cvc);
      setIsSubmitting(false);
      return;
    }

    try {
      const order = await createOrderForUser(user);

      window.dispatchEvent(new Event("cart-updated"));

      navigate(`/order-confirmation?orderId=${order.id}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Ekki tókst að klára pöntun",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-semibold text-stone-950">Greiðsla</h1>
        <p className="mt-6 text-stone-600">Sæki körfu...</p>
      </main>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-semibold text-stone-950">Greiðsla</h1>

        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-8 text-center">
          <p className="text-stone-600">
            Þú þarft að skrá þig inn til að ganga frá pöntun.
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

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-semibold text-stone-950">Greiðsla</h1>

        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-8 text-center">
          <p className="text-stone-600">Karfan er tóm.</p>

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
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-stone-950">Greiðsla</h1>
        <p className="mt-2 text-stone-600">
          Þetta er gervigreiðsluferli. Engin raunveruleg greiðsla fer fram.
        </p>
      </div>

      {errorMessage && (
        <p className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-stone-950">
            Afhendingarupplýsingar
          </h2>

          <div className="mt-6 grid gap-4">
            <label className="block space-y-1">
              <span className="text-sm font-medium text-stone-700">Nafn</span>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-stone-950"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-stone-700">
                Heimilisfang
              </span>
              <input
                type="text"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                required
                className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-stone-950"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
              <label className="block space-y-1">
                <span className="text-sm font-medium text-stone-700">
                  Póstnúmer
                </span>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(event) => setPostalCode(event.target.value)}
                  required
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-stone-950"
                />
              </label>

              <label className="block space-y-1">
                <span className="text-sm font-medium text-stone-700">Bær</span>
                <input
                  type="text"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  required
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-stone-950"
                />
              </label>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-stone-50 p-5">
            <h2 className="text-xl font-semibold text-stone-950">
              Gervigreiðsla
            </h2>

            <p className="mt-2 text-sm text-stone-600">
              Þessi greiðsla er aðeins til sýnis fyrir lokaverkefnið. Engar
              kortaupplýsingar eru vistaðar.
            </p>

            <div className="mt-4 grid gap-4">
              <label className="block space-y-1">
                <span className="text-sm font-medium text-stone-700">
                  Nafn á korti
                </span>
                <input
                  type="text"
                  required
                  placeholder="Prufu Notandi"
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-stone-950"
                />
              </label>

              <label className="block space-y-1">
                <span className="text-sm font-medium text-stone-700">
                  Kortanúmer
                </span>

                <div className="flex items-center gap-3 rounded-lg border border-stone-300 bg-white px-3 py-2 focus-within:border-stone-950">
                  <input
                    {...getCardNumberProps()}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    className="w-full bg-transparent outline-none"
                  />
                </div>

                {meta.touchedInputs.cardNumber &&
                  meta.erroredInputs.cardNumber && (
                    <p className="text-xs text-red-600">
                      {meta.erroredInputs.cardNumber}
                    </p>
                  )}
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-sm font-medium text-stone-700">
                    Gildistími
                  </span>

                  <input
                    {...getExpiryDateProps()}
                    placeholder="12/30"
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-stone-950"
                  />

                  {meta.touchedInputs.expiryDate &&
                    meta.erroredInputs.expiryDate && (
                      <p className="text-xs text-red-600">
                        {meta.erroredInputs.expiryDate}
                      </p>
                    )}
                </label>

                <label className="block space-y-1">
                  <span className="text-sm font-medium text-stone-700">
                    CVC
                  </span>

                  <input
                    {...getCVCProps()}
                    placeholder="123"
                    maxLength={3}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-stone-950"
                  />
                  {meta.touchedInputs.cvc && meta.erroredInputs.cvc && (
                    <p className="text-xs text-red-600">
                      {meta.erroredInputs.cvc}
                    </p>
                  )}
                </label>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 w-full rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {isSubmitting ? "Klára pöntun..." : "Staðfesta gervigreiðslu"}
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-950">
            Pöntunaryfirlit
          </h2>

          <div className="mt-5 space-y-4 border-b border-stone-200 pb-5">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 text-sm">
                <div>
                  <p className="font-medium text-stone-950">
                    {item.product.name}
                  </p>
                  <p className="text-stone-500">Magn: {item.quantity}</p>
                </div>

                <p className="font-medium text-stone-950">
                  {(
                    (item.product.price_cents / 100) *
                    item.quantity
                  ).toLocaleString("is-IS")}{" "}
                  kr.
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex justify-between text-sm text-stone-600">
              <span>Samtals magn</span>
              <span>{totalQuantity}</span>
            </div>

            <div className="flex justify-between text-lg font-semibold text-stone-950">
              <span>Samtals</span>
              <span>{(totalCents / 100).toLocaleString("is-IS")} kr.</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import {
  getCartItemsForUser,
  type SupabaseCartItem,
} from "../features/cart/api/cartApi";
import { createOrderForUser } from "../features/orders/api/ordersApi";
import { usePaymentInputs } from "react-payment-inputs";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "../features/checkout/model/checkoutSchema";
import { OrderSummary } from "../features/checkout/components/OrderSummary";
import { FakePaymentSection } from "../features/checkout/components/FakePaymentSections";
import { DeliveryDetailsSection } from "../features/checkout/components/DeliveryDetailsSection";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [items, setItems] = useState<SupabaseCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { getCardNumberProps, getExpiryDateProps, getCVCProps, meta } =
    usePaymentInputs();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      address: "",
      postalCode: "",
      city: "",
    },
  });

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

        setValue(
          "fullName",
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
  }, [isLoggedIn, user, setValue]);

  const totalCents = items.reduce((sum, item) => {
    return sum + item.product.price_cents * item.quantity;
  }, 0);

  const totalQuantity = items.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  async function onSubmit(_values: CheckoutFormValues) {
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
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
        >
          <DeliveryDetailsSection register={register} errors={errors} />

          <FakePaymentSection
            meta={meta}
            getCardNumberProps={getCardNumberProps}
            getExpiryDateProps={getExpiryDateProps}
            getCVCProps={getCVCProps}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 w-full rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {isSubmitting ? "Klára pöntun..." : "Staðfesta gervigreiðslu"}
          </button>
        </form>
        <OrderSummary
          cartItems={items}
          totalQuantity={totalQuantity}
          totalPrice={totalCents}
        />
      </div>
    </main>
  );
}

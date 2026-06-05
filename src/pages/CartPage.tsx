import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../features/auth/hooks/useAuth";
import {
  removeCartItem,
  updateCartItemQuantity,
} from "../features/cart/api/cartApi";
import { useDbCart } from "../features/cart/hooks/useDbCart";
import { useCartStore } from "../features/cart/store/cartStore";

export function CartPage() {
  const queryClient = useQueryClient();
  const { user, isLoggedIn } = useAuth();

  const localItems = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const isDbCart = Boolean(isLoggedIn && user);

  const {
    dbItems,
    isLoading: isDbCartLoading,
    errorMessage: dbCartErrorMessage,
  } = useDbCart(user);

  const displayedItems = isDbCart ? dbItems : localItems;

  const totalPrice = isDbCart
    ? dbItems.reduce((sum, item) => {
        const price = item.variant?.price ?? item.product.price;
        return sum + price * item.quantity;
      }, 0)
    : localItems.reduce((sum, item) => {
        const price = item.variant?.price ?? item.product.price;
        return sum + price * item.quantity;
      }, 0);

  const totalQuantity = isDbCart
    ? dbItems.reduce((sum, item) => sum + item.quantity, 0)
    : localItems.reduce((sum, item) => sum + item.quantity, 0);

  async function refreshDbCart() {
    await queryClient.invalidateQueries({
      queryKey: ["db-cart", user?.id],
    });

    window.dispatchEvent(new Event("cart-updated"));
  }

  async function handleClearCart() {
    setErrorMessage("");

    if (!isDbCart) {
      clearCart();
      return;
    }

    try {
      clearCart();

      await Promise.all(dbItems.map((item) => removeCartItem(item.id)));
      await refreshDbCart();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Ekki tókst að tæma körfu.",
      );
    }
  }

  async function handleRemoveDbItem(item: (typeof dbItems)[number]) {
    setErrorMessage("");
    setUpdatingItemId(item.id);

    try {
      removeFromCart(item.product.id, item.variant?.id ?? null);

      await removeCartItem(item.id);
      await refreshDbCart();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Ekki tókst að fjarlægja vöru.",
      );
    } finally {
      setUpdatingItemId(null);
    }
  }

  async function handleDecreaseDbItem(item: (typeof dbItems)[number]) {
    setErrorMessage("");
    setUpdatingItemId(item.id);

    try {
      if (item.quantity <= 1) {
        removeFromCart(item.product.id, item.variant?.id ?? null);
        await removeCartItem(item.id);
      } else {
        decreaseQuantity(item.product.id, item.variant?.id ?? null);

        await updateCartItemQuantity({
          cartItemId: item.id,
          quantity: item.quantity - 1,
        });
      }

      await refreshDbCart();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Ekki tókst að uppfæra körfu.",
      );
    } finally {
      setUpdatingItemId(null);
    }
  }

  async function handleIncreaseDbItem(params: {
    item: (typeof dbItems)[number];
    stock: number;
  }) {
    const { item, stock } = params;

    setErrorMessage("");
    setUpdatingItemId(item.id);

    try {
      increaseQuantity(item.product.id, item.variant?.id ?? null);

      await updateCartItemQuantity({
        cartItemId: item.id,
        quantity: Math.min(item.quantity + 1, stock),
      });

      await refreshDbCart();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Ekki tókst að uppfæra körfu.",
      );
    } finally {
      setUpdatingItemId(null);
    }
  }

  if (isDbCart && isDbCartLoading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-bold text-stone-950">Karfa</h1>
        <p className="mt-6 text-stone-600">Sæki körfu...</p>
      </main>
    );
  }

  if (displayedItems.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-bold text-stone-950">Karfa</h1>

        {(errorMessage || dbCartErrorMessage) && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {errorMessage || dbCartErrorMessage}
          </p>
        )}

        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
          <p className="text-stone-600">Karfan þín er tóm.</p>

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
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-stone-950">Karfa</h1>

        <button
          type="button"
          onClick={handleClearCart}
          className="text-sm font-medium text-stone-500 underline hover:text-red-600"
        >
          Tæma körfu
        </button>
      </div>

      {(errorMessage || dbCartErrorMessage) && (
        <p className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {errorMessage || dbCartErrorMessage}
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <section className="space-y-4">
          {isDbCart
            ? dbItems.map((item) => {
                const price = item.variant?.price ?? item.product.price;
                const stock =
                  item.variant?.stock ??
                  item.product.stock_quantity ??
                  item.product.stock;

                return (
                  <article
                    key={`db-${item.id}`}
                    className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-[120px_1fr_auto]"
                  >
                    <div className="h-32 overflow-hidden rounded-xl bg-stone-100">
                      {item.product.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-stone-400">
                          Engin mynd
                        </div>
                      )}
                    </div>

                    <div>
                      <h2 className="font-semibold text-stone-950">
                        {item.product.name}
                      </h2>

                      {item.variant && (
                        <p className="mt-1 text-sm text-stone-500">
                          {item.variant.color_name ?? item.variant.name}
                        </p>
                      )}

                      <p className="mt-1 text-sm text-stone-500">
                        {price.toLocaleString("is-IS")} kr.
                      </p>

                      {item.quantity >= stock && (
                        <p className="mt-2 text-xs text-amber-700">
                          Hámarksfjöldi á lager valinn
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveDbItem(item)}
                        disabled={updatingItemId === item.id}
                        className="mt-4 text-sm text-stone-400 hover:text-red-600 disabled:cursor-not-allowed disabled:text-stone-300"
                      >
                        Fjarlægja
                      </button>
                    </div>

                    <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:justify-between">
                      <div className="flex overflow-hidden rounded-full border border-stone-300">
                        <button
                          type="button"
                          onClick={() => handleDecreaseDbItem(item)}
                          disabled={updatingItemId === item.id}
                          className="px-4 py-2 text-stone-700 hover:bg-stone-100 disabled:cursor-not-allowed disabled:text-stone-300"
                        >
                          -
                        </button>

                        <span className="px-4 py-2 text-sm">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleIncreaseDbItem({
                              item,
                              stock,
                            })
                          }
                          disabled={
                            item.quantity >= stock || updatingItemId === item.id
                          }
                          className="px-4 py-2 text-stone-700 hover:bg-stone-100 disabled:cursor-not-allowed disabled:text-stone-300"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-semibold text-stone-950">
                        {(price * item.quantity).toLocaleString("is-IS")} kr.
                      </p>
                    </div>
                  </article>
                );
              })
            : localItems.map((item) => {
                const price = item.variant?.price ?? item.product.price;
                const stock = item.variant?.stock ?? item.product.stock;

                return (
                  <article
                    key={`local-${item.product.id}-${
                      item.variant?.id ?? "no-variant"
                    }`}
                    className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-[120px_1fr_auto]"
                  >
                    <div className="h-32 overflow-hidden rounded-xl bg-stone-100">
                      {(item.variant?.image_url ?? item.product.image_url) ? (
                        <img
                          src={
                            item.variant?.image_url ??
                            item.product.image_url ??
                            ""
                          }
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-stone-400">
                          Engin mynd
                        </div>
                      )}
                    </div>

                    <div>
                      <h2 className="font-semibold text-stone-950">
                        {item.product.name}
                      </h2>

                      {item.variant && (
                        <p className="mt-1 text-sm text-stone-500">
                          {item.variant.color_name ?? item.variant.name}
                        </p>
                      )}

                      <p className="mt-1 text-sm text-stone-500">
                        {price.toLocaleString("is-IS")} kr.
                      </p>

                      {item.quantity >= stock && (
                        <p className="mt-2 text-xs text-amber-700">
                          Hámarksfjöldi á lager valinn
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(
                            item.product.id,
                            item.variant?.id ?? null,
                          )
                        }
                        className="mt-4 text-sm text-stone-400 hover:text-red-600"
                      >
                        Fjarlægja
                      </button>
                    </div>

                    <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:justify-between">
                      <div className="flex overflow-hidden rounded-full border border-stone-300">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity <= 1) {
                              removeFromCart(
                                item.product.id,
                                item.variant?.id ?? null,
                              );
                              return;
                            }

                            decreaseQuantity(
                              item.product.id,
                              item.variant?.id ?? null,
                            );
                          }}
                          className="px-4 py-2 text-stone-700 hover:bg-stone-100"
                        >
                          -
                        </button>

                        <span className="px-4 py-2 text-sm">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(
                              item.product.id,
                              item.variant?.id ?? null,
                            )
                          }
                          disabled={item.quantity >= stock}
                          className="px-4 py-2 text-stone-700 hover:bg-stone-100 disabled:cursor-not-allowed disabled:text-stone-300"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-semibold text-stone-950">
                        {(price * item.quantity).toLocaleString("is-IS")} kr.
                      </p>
                    </div>
                  </article>
                );
              })}
        </section>

        <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-stone-950">Samantekt</h2>

          <div className="mt-5 space-y-3">
            <div className="flex justify-between text-sm text-stone-600">
              <span>Vörur</span>
              <span>{displayedItems.length}</span>
            </div>

            <div className="flex justify-between text-sm text-stone-600">
              <span>Samtals magn</span>
              <span>{totalQuantity}</span>
            </div>

            <div className="flex justify-between text-lg font-semibold text-stone-950">
              <span>Samtals</span>
              <span>{totalPrice.toLocaleString("is-IS")} kr.</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="mt-6 flex w-full justify-center rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            Halda áfram
          </Link>
        </aside>
      </div>
    </main>
  );
}

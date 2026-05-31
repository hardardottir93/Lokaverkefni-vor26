import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import {
  getCartItemsForUser,
  removeCartItem,
  updateCartItemQuantity,
  type SupabaseCartItem,
} from "../features/cart/api/cartApi";
import { useCartStore } from "../features/cart/store/cartStore";

export function CartPage() {
  const { user, isLoggedIn } = useAuth();

  const localItems = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const [dbItems, setDbItems] = useState<SupabaseCartItem[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const isDbCart = Boolean(isLoggedIn && user);
  const displayedItems = isDbCart ? dbItems : localItems;

  async function loadDbCart(showLoading = false) {
    if (!user) return;

    if (showLoading) {
      setIsLoading(true);
    }

    setErrorMessage("");

    try {
      const items = await getCartItemsForUser(user);
      setDbItems(items);
    } catch (error) {
      console.error("GET CART ERROR", error);
      setErrorMessage("Ekki tókst að sækja körfu");
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (isDbCart) {
      loadDbCart(true);
    }
  }, [isDbCart, user]);

  const totalPrice = isDbCart
    ? dbItems.reduce((sum, item) => {
        return sum + (item.product.price_cents / 100) * item.quantity;
      }, 0)
    : localItems.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
      }, 0);

  const totalQuantity = isDbCart
    ? dbItems.reduce((sum, item) => sum + item.quantity, 0)
    : localItems.reduce((sum, item) => sum + item.quantity, 0);

  async function handleClearCart() {
    if (!isDbCart) {
      clearCart();
      return;
    }

    for (const item of dbItems) {
      await removeCartItem(item.id);
    }

    await loadDbCart();
    window.dispatchEvent(new Event("cart-updated"));
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-semibold text-stone-950">Karfa</h1>
        <p className="mt-6 text-stone-600">Sæki körfu...</p>
      </main>
    );
  }

  if (displayedItems.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-semibold text-stone-950">Karfa</h1>

        {errorMessage && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-8 text-center">
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
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-stone-950">Karfa</h1>

        <button
          type="button"
          onClick={handleClearCart}
          className="text-sm font-medium text-stone-500 hover:text-red-600"
        >
          Tæma körfu
        </button>
      </div>

      {errorMessage && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-4">
          {isDbCart
            ? dbItems.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
                >
                  <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-stone-400">
                        Engin mynd
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-4">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h2 className="font-semibold text-stone-950">
                          {item.product.name}
                        </h2>

                        <p className="mt-1 text-sm text-stone-500">
                          {(item.product.price_cents / 100).toLocaleString(
                            "is-IS",
                          )}{" "}
                          kr.
                        </p>

                        {item.quantity >= item.product.stock_quantity && (
                          <p className="mt-1 text-xs text-stone-500">
                            Hámarksfjöldi á lager valinn
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          await removeCartItem(item.id);
                          await loadDbCart();
                          window.dispatchEvent(new Event("cart-updated"));
                        }}
                        className="text-sm text-stone-400 hover:text-red-600"
                      >
                        Fjarlægja
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center overflow-hidden rounded-full border border-stone-300">
                        <button
                          type="button"
                          onClick={async () => {
                            setUpdatingItemId(item.id);

                            try {
                              if (item.quantity <= 1) {
                                await removeCartItem(item.id);
                              } else {
                                await updateCartItemQuantity({
                                  cartItemId: item.id,
                                  quantity: item.quantity - 1,
                                });
                              }

                              await loadDbCart(false);
                              window.dispatchEvent(new Event("cart-updated"));
                            } finally {
                              setUpdatingItemId(null);
                            }
                          }}
                          disabled={updatingItemId === item.id}
                          className="px-4 py-2 text-stone-700 hover:bg-stone-100 disabled:cursor-not-allowed disabled:text-stone-300"
                        >
                          -
                        </button>

                        <span className="min-w-10 px-3 text-center text-sm font-medium">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={async () => {
                            setUpdatingItemId(item.id);

                            try {
                              await updateCartItemQuantity({
                                cartItemId: item.id,
                                quantity: Math.min(
                                  item.quantity + 1,
                                  item.product.stock_quantity,
                                ),
                              });

                              await loadDbCart(false);
                              window.dispatchEvent(new Event("cart-updated"));
                            } finally {
                              setUpdatingItemId(null);
                            }
                          }}
                          disabled={
                            item.quantity >= item.product.stock_quantity ||
                            updatingItemId === item.id
                          }
                          className="px-4 py-2 text-stone-700 hover:bg-stone-100 disabled:cursor-not-allowed disabled:text-stone-300"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-semibold text-stone-950">
                        {(
                          (item.product.price_cents / 100) *
                          item.quantity
                        ).toLocaleString("is-IS")}{" "}
                        kr.
                      </p>
                    </div>
                  </div>
                </article>
              ))
            : localItems.map((item) => (
                <article
                  key={item.product.id}
                  className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
                >
                  <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-stone-400">
                        Engin mynd
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-4">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h2 className="font-semibold text-stone-950">
                          {item.product.name}
                        </h2>

                        <p className="mt-1 text-sm text-stone-500">
                          {item.product.price.toLocaleString("is-IS")} kr.
                        </p>

                        {item.quantity >= item.product.stock && (
                          <p className="mt-1 text-xs text-stone-500">
                            Hámarksfjöldi á lager valinn
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-sm text-stone-400 hover:text-red-600"
                      >
                        Fjarlægja
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center overflow-hidden rounded-full border border-stone-300">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity <= 1) {
                              removeFromCart(item.product.id);
                              return;
                            }

                            decreaseQuantity(item.product.id);
                          }}
                          className="px-4 py-2 text-stone-700 hover:bg-stone-100"
                        >
                          -
                        </button>

                        <span className="min-w-10 px-3 text-center text-sm font-medium">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.product.id)}
                          disabled={item.quantity >= item.product.stock}
                          className="px-4 py-2 text-stone-700 hover:bg-stone-100 disabled:cursor-not-allowed disabled:text-stone-300"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-semibold text-stone-950">
                        {(item.product.price * item.quantity).toLocaleString(
                          "is-IS",
                        )}{" "}
                        kr.
                      </p>
                    </div>
                  </div>
                </article>
              ))}
        </section>

        <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-950">Samantekt</h2>

          <div className="mt-5 space-y-3 border-b border-stone-200 pb-5">
            <div className="flex justify-between text-sm text-stone-600">
              <span>Vörur</span>
              <span>{displayedItems.length}</span>
            </div>

            <div className="flex justify-between text-sm text-stone-600">
              <span>Samtals magn</span>
              <span>{totalQuantity}</span>
            </div>
          </div>

          <div className="mt-5 flex justify-between text-lg font-semibold text-stone-950">
            <span>Samtals</span>
            <span>{totalPrice.toLocaleString("is-IS")} kr.</span>
          </div>

          <Link
            to="/checkout"
            className="mt-6 inline-flex w-full justify-center rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            Halda áfram
          </Link>
        </aside>
      </div>
    </main>
  );
}

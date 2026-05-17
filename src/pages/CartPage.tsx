import { Link } from "react-router-dom";
import { useCartStore } from "../features/cart/store/cartStore";

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const totalPrice = items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-semibold text-stone-950">Karfa</h1>

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
          onClick={clearCart}
          className="text-sm font-medium text-stone-500 hover:text-red-600"
        >
          Tæma körfu
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-4">
          {items.map((item) => (
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
                      onClick={() => decreaseQuantity(item.product.id)}
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
                      className="px-4 py-2 text-stone-700 hover:bg-stone-100"
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
              <span>{items.length}</span>
            </div>

            <div className="flex justify-between text-sm text-stone-600">
              <span>Samtals magn</span>
              <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
          </div>

          <div className="mt-5 flex justify-between text-lg font-semibold text-stone-950">
            <span>Samtals</span>
            <span>{totalPrice.toLocaleString("is-IS")} kr.</span>
          </div>

          <button
            type="button"
            className="mt-6 w-full rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            Halda áfram
          </button>
        </aside>
      </div>
    </main>
  );
}

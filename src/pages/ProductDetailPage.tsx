import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCartStore } from "../features/cart/store/cartStore";
import { useProduct } from "../features/products/hooks/useProduct";
import { useAuth } from "../features/auth/hooks/useAuth";
import { syncUserCart } from "../features/cart/api/cartSyncApi";

export function ProductDetailPage() {
  const { id } = useParams();

  const { user, isLoggedIn } = useAuth();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { product, isLoading, errorMessage } = useProduct(id);
  const [quantity, setQuantity] = useState(1);

  const addToCart = useCartStore((state) => state.addToCart);

  async function handleAddToCart() {
    if (!product) return;

    if (!isLoggedIn || !user) {
      addToCart(product, quantity);
      return;
    }

    setIsAddingToCart(true);

    try {
      await syncUserCart({
        user,
        items: [
          {
            product,
            quantity,
          },
        ],
      });

      window.dispatchEvent(new Event("cart-updated"));
    } finally {
      setIsAddingToCart(false);
    }
  }

  if (isLoading) {
    return <p className="p-6">Sæki vöru...</p>;
  }

  if (errorMessage) {
    return <p className="p-6 text-red-600">{errorMessage}</p>;
  }

  if (!product) {
    return <p className="p-6">Vara fannst ekki.</p>;
  }

  const isInStock = product.stock > 0;
  const stock = product.stock;

  function decreaseQuantity() {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  }

  function increaseQuantity() {
    setQuantity((currentQuantity) => Math.min(stock, currentQuantity + 1));
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-gray-100">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-96 items-center justify-center text-gray-400">
              Engin mynd
            </div>
          )}
        </div>

        <section className="space-y-5">
          {product.categories?.name && (
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
              {product.categories.name}
            </p>
          )}

          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            <p className="mt-3 text-2xl font-semibold text-gray-900">
              {product.price.toLocaleString("is-IS")} kr.
            </p>

            <p
              className={`mt-2 text-sm font-medium ${
                isInStock ? "text-emerald-700" : "text-red-600"
              }`}
            >
              {isInStock ? `${stock} á lager` : "Uppselt"}
            </p>
          </div>

          {product.description && (
            <div>
              <h2 className="mb-2 text-lg font-semibold">Lýsing</h2>
              <p className="leading-7 text-gray-700">{product.description}</p>
            </div>
          )}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex w-fit items-center overflow-hidden rounded-full border border-stone-300">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={!isInStock || quantity <= 1}
                className="px-4 py-3 text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:text-stone-300"
              >
                -
              </button>

              <span className="min-w-12 px-4 text-center text-sm font-semibold text-stone-950">
                {quantity}
              </span>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={!isInStock || quantity >= stock}
                className="px-4 py-3 text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:text-stone-300"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isInStock}
              className="w-full rounded-full bg-stone-950 px-6 py-3 font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300 sm:w-auto"
            >
              {isInStock ? "Bæta í körfu" : "Uppselt"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

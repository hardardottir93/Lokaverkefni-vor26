import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { syncUserCart } from "../features/cart/api/cartSyncApi";
import { useCartStore } from "../features/cart/store/cartStore";
import { useProduct } from "../features/products/hooks/useProduct";
import type { ProductVariant } from "../features/products/model/product";

export function ProductDetailPage() {
  const { id } = useParams();

  const { user, isLoggedIn } = useAuth();
  const { product, isLoading, errorMessage } = useProduct(id);

  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  const addToCart = useCartStore((state) => state.addToCart);

  const variants = useMemo(
    () => product?.product_variants ?? [],
    [product?.product_variants],
  );

  const hasVariants = variants.length > 0;

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );

  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ??
    variants[0] ??
    null;

  if (isLoading) {
    return <p className="p-6">Sæki vöru...</p>;
  }

  if (errorMessage) {
    return <p className="p-6 text-red-600">{errorMessage}</p>;
  }

  if (!product) {
    return <p className="p-6">Vara fannst ekki.</p>;
  }

  const activeStock = selectedVariant ? selectedVariant.stock : product.stock;
  const activePrice = selectedVariant?.price ?? product.price;
  const isInStock = activeStock > 0;
  const activeImageUrl = selectedVariant?.image_url ?? product.image_url;

  function decreaseQuantity() {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  }

  function increaseQuantity() {
    setQuantity((currentQuantity) =>
      Math.min(activeStock, currentQuantity + 1),
    );
  }

  function handleSelectVariant(variant: ProductVariant) {
    setSelectedVariantId(variant.id);
    setQuantity(1);
    setCartMessage("");
  }

  async function handleAddToCart() {
    if (!product) return;

    setCartMessage("");

    if (hasVariants && !selectedVariant) {
      setCartMessage("Veldu lit áður en þú bætir í körfu.");
      return;
    }

    addToCart(product, quantity, selectedVariant);

    if (!isLoggedIn || !user) {
      setCartMessage(
        selectedVariant
          ? `${selectedVariant.name} var bætt í körfu.`
          : "Vöru var bætt í körfu.",
      );
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
            variant: selectedVariant,
          },
        ],
      });

      window.dispatchEvent(new Event("cart-updated"));

      setCartMessage(
        selectedVariant
          ? `${selectedVariant.name} var bætt í körfu.`
          : "Vöru var bætt í körfu.",
      );
    } catch (error) {
      setCartMessage(
        error instanceof Error ? error.message : "Ekki tókst að bæta í körfu",
      );
    } finally {
      setIsAddingToCart(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-gray-100">
          {activeImageUrl ? (
            <img
              src={activeImageUrl}
              alt={
                selectedVariant
                  ? `${product.name} - ${selectedVariant.color_name ?? selectedVariant.name}`
                  : product.name
              }
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
              {activePrice.toLocaleString("is-IS")} kr.
            </p>

            <p
              className={`mt-2 text-sm font-medium ${
                isInStock ? "text-emerald-700" : "text-red-600"
              }`}
            >
              {isInStock ? `${activeStock} á lager` : "Uppselt"}
            </p>
          </div>

          {product.description && (
            <div>
              <h2 className="mb-2 text-lg font-semibold">Lýsing</h2>
              <p className="leading-7 text-gray-700">{product.description}</p>
            </div>
          )}
          {hasVariants && (
            <div>
              <label className="block space-y-2">
                <span className="text-lg font-semibold text-stone-950">
                  Veldu lit
                </span>

                <select
                  value={selectedVariant?.id ?? ""}
                  onChange={(event) => {
                    const variant = variants.find(
                      (currentVariant) =>
                        currentVariant.id === event.target.value,
                    );

                    if (variant) {
                      handleSelectVariant(variant);
                    }
                  }}
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
                >
                  {variants.map((variant) => (
                    <option
                      key={variant.id}
                      value={variant.id}
                      disabled={variant.stock <= 0}
                    >
                      {variant.color_name ?? variant.name}
                      {variant.stock <= 0
                        ? " - Uppselt"
                        : ` - ${variant.stock} á lager`}
                    </option>
                  ))}
                </select>
              </label>

              {selectedVariant && (
                <p className="mt-3 text-sm text-stone-500">
                  Valinn litur:{" "}
                  <span className="font-medium text-stone-950">
                    {selectedVariant.color_name ?? selectedVariant.name}
                  </span>
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex w-fit items-center overflow-hidden rounded-full border border-stone-300">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={!isInStock || quantity <= 1 || isAddingToCart}
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
                disabled={
                  !isInStock || quantity >= activeStock || isAddingToCart
                }
                className="px-4 py-3 text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:text-stone-300"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isInStock || isAddingToCart}
              className="w-full rounded-full bg-stone-950 px-6 py-3 font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300 sm:w-auto"
            >
              {!isInStock
                ? "Uppselt"
                : isAddingToCart
                  ? "Bæti í körfu..."
                  : "Bæta í körfu"}
            </button>
          </div>

          {cartMessage && (
            <p
              className={`text-sm font-medium ${
                cartMessage.includes("Ekki") || cartMessage.includes("Veldu")
                  ? "text-red-600"
                  : "text-emerald-700"
              }`}
            >
              {cartMessage}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

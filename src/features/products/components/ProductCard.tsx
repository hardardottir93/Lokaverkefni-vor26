import { useNavigate } from "react-router-dom";
import type { Product, ProductVariant } from "../model/product";
import { useAddToCart } from "../../cart/hooks/useAddToCart";

type ProductCardProps = {
  product: Product;
  variant?: ProductVariant | null;
};

export function ProductCard({ product, variant = null }: ProductCardProps) {
  const navigate = useNavigate();
  const { addToCart, isAddingToCart } = useAddToCart();

  const hasVariants = (product.product_variants?.length ?? 0) > 0;
  const isVariantCard = Boolean(variant);

  const variantName = variant?.color_name ?? variant?.size ?? variant?.name;

  const displayName = variantName
    ? `${product.name} - ${variantName}`
    : product.name;

  const productImageUrl =
    variant?.image_url ??
    product.image_url ??
    product.product_variants?.find((currentVariant) => currentVariant.image_url)
      ?.image_url ??
    null;

  const stock = variant?.stock ?? product.stock;
  const price = variant?.price ?? product.price;
  const isInStock = stock > 0;

  function handleCardClick() {
    if (variant?.id) {
      navigate(`/products/${product.id}?variant=${variant.id}`);
      return;
    }

    navigate(`/products/${product.id}`);
  }

  return (
    <article
      onClick={handleCardClick}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        {productImageUrl ? (
          <img
            src={productImageUrl}
            alt={displayName}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-500">
            Engin mynd
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-700 shadow-sm">
          {product.categories.name}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h2 className="text-lg font-bold text-stone-950">{displayName}</h2>

          <p className="mt-1 line-clamp-2 text-sm leading-6 text-stone-600">
            {product.description}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xl font-bold text-stone-950">
              {price.toLocaleString("is-IS")} kr.
            </p>

            <p
              className={`text-sm font-medium ${
                isInStock ? "text-emerald-700" : "text-red-600"
              }`}
            >
              {isInStock ? `${stock} á lager` : "Uppselt"}
            </p>
          </div>

          {hasVariants && !isVariantCard ? (
            <span className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-950 transition group-hover:border-stone-950">
              Velja
            </span>
          ) : (
            <button
              type="button"
              onClick={async (event) => {
                event.preventDefault();
                event.stopPropagation();

                await addToCart({
                  product,
                  quantity: 1,
                  variant,
                });
              }}
              disabled={!isInStock || isAddingToCart}
              className="rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              {!isInStock
                ? "Uppselt"
                : isAddingToCart
                  ? "Bæti..."
                  : "Bæta í körfu"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

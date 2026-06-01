import { useMemo, useState } from "react";

import { ProductCard } from "../features/products/components/ProductCard";
import { useCategories } from "../features/products/hooks/useCategories";
import { useProducts } from "../features/products/hooks/useProducts";
import type {
  Product,
  ProductVariant,
} from "../features/products/model/product";

type SortOption = "newest" | "price-asc" | "price-desc";

export function ProductsPage() {
  const {
    products,
    isLoading: isProductsLoading,
    errorMessage: productsErrorMessage,
  } = useProducts();

  const {
    categories,
    isLoading: isCategoriesLoading,
    errorMessage: categoriesErrorMessage,
  } = useCategories();

  const isLoading = isProductsLoading || isCategoriesLoading;
  const errorMessage = productsErrorMessage || categoriesErrorMessage;

  const [selectedCategorySlugs, setSelectedCategorySlugs] = useState<string[]>(
    [],
  );
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  type ProductListItem = {
    product: Product;
    variant: ProductVariant | null;
  };

  const filteredProducts = useMemo(() => {
    const productListItems = products.flatMap<ProductListItem>((product) => {
      const variants = product.product_variants ?? [];

      if (variants.length === 0) {
        return [
          {
            product,
            variant: null,
          },
        ];
      }

      return variants.map((variant) => ({
        product,
        variant,
      }));
    });

    let nextItems = [...productListItems];

    if (selectedCategorySlugs.length > 0) {
      nextItems = nextItems.filter((item) =>
        selectedCategorySlugs.includes(item.product.categories?.slug ?? ""),
      );
    }

    if (showOnlyInStock) {
      nextItems = nextItems.filter((item) => {
        const stock = item.variant?.stock ?? item.product.stock;
        return stock > 0;
      });
    }

    nextItems.sort((a, b) => {
      const priceA = a.variant?.price ?? a.product.price;
      const priceB = b.variant?.price ?? b.product.price;

      if (sortOption === "price-asc") {
        return priceA - priceB;
      }

      if (sortOption === "price-desc") {
        return priceB - priceA;
      }

      return (
        new Date(b.product.created_at).getTime() -
        new Date(a.product.created_at).getTime()
      );
    });

    return nextItems;
  }, [products, selectedCategorySlugs, showOnlyInStock, sortOption]);

  function toggleCategory(slug: string) {
    setSelectedCategorySlugs((currentSlugs) => {
      if (currentSlugs.includes(slug)) {
        return currentSlugs.filter((currentSlug) => currentSlug !== slug);
      }

      return [...currentSlugs, slug];
    });
  }

  function clearFilters() {
    setSelectedCategorySlugs([]);
    setShowOnlyInStock(false);
    setSortOption("newest");
  }

  const hasActiveFilters =
    selectedCategorySlugs.length > 0 ||
    showOnlyInStock ||
    sortOption !== "newest";

  if (isLoading) {
    return <p className="p-6">Loading products...</p>;
  }

  if (errorMessage) {
    return <p className="p-6 text-red-600">Error: {errorMessage}</p>;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Netverslun
        </p>

        <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-stone-950">Vörur</h1>
            <p className="mt-2 max-w-2xl text-stone-600">
              Skoðaðu úrval af garni, prjónum, uppskriftum og handavinnuvörum.
            </p>
          </div>

          <p className="text-sm text-stone-500">
            {filteredProducts.length} vörur fundust
          </p>
        </div>
      </div>

      <section className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsFilterOpen((current) => !current)}
            className="rounded-full border border-stone-300 bg-white px-5 py-2 text-sm font-semibold text-stone-950 transition hover:border-stone-950"
          >
            {isFilterOpen ? "Loka síu" : "Sía vörur"}
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-stone-500 underline hover:text-stone-950"
            >
              Hreinsa síu
            </button>
          )}
        </div>

        {isFilterOpen && (
          <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-500">
                  Flokkar
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const isChecked = selectedCategorySlugs.includes(
                      category.slug,
                    );

                    return (
                      <label
                        key={category.id}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                          isChecked
                            ? "border-stone-950 bg-stone-950 text-white"
                            : "border-stone-300 bg-white text-stone-700 hover:border-stone-950"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCategory(category.slug)}
                          className="sr-only"
                        />

                        <span>{category.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:min-w-72 lg:grid-cols-1">
                <label className="block space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-stone-500">
                    Röðun
                  </span>

                  <select
                    value={sortOption}
                    onChange={(event) =>
                      setSortOption(event.target.value as SortOption)
                    }
                    className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-950"
                  >
                    <option value="newest">Nýjast fyrst</option>
                    <option value="price-asc">Verð: lægst fyrst</option>
                    <option value="price-desc">Verð: hæst fyrst</option>
                  </select>
                </label>

                <label className="flex items-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-700">
                  <input
                    type="checkbox"
                    checked={showOnlyInStock}
                    onChange={(event) =>
                      setShowOnlyInStock(event.target.checked)
                    }
                    className="h-4 w-4 accent-stone-950"
                  />
                  Bara til á lager
                </label>
              </div>
            </div>
          </div>
        )}
      </section>

      {filteredProducts.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-6 text-center text-stone-600">
          <p>Engar vörur fundust.</p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 rounded-full bg-stone-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            Hreinsa síu
          </button>
        </div>
      ) : (
        <ul className="grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((item) => (
            <li key={`${item.product.id}-${item.variant?.id ?? "no-variant"}`}>
              <ProductCard product={item.product} variant={item.variant} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

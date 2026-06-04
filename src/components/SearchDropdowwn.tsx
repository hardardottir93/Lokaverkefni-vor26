import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../features/products/api/productsApi";
import type { Product } from "../features/products/model/product";

type SearchDropdownProps = {
  onClose: () => void;
};

export function SearchDropdown({ onClose }: SearchDropdownProps) {
  const [searchValue, setSearchValue] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch {
        console.error("Ekki tókst að sækja vörur fyrir leit.");
      }
    }

    fetchProducts();
  }, []);

  const searchResults = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    if (!search) {
      return [];
    }

    return products
      .filter((product) => {
        return (
          product.name.toLowerCase().includes(search) ||
          product.description?.toLowerCase().includes(search) ||
          product.categories.name.toLowerCase().includes(search)
        );
      })
      .slice(0, 5);
  }, [products, searchValue]);

  function handleSearch(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedSearch = searchValue.trim();

    if (!trimmedSearch) {
      navigate("/products");
      onClose();
      return;
    }

    navigate(`/products?search=${encodeURIComponent(trimmedSearch)}`);
    onClose();
  }

  function handleProductClick(productId: string | number) {
    navigate(`/products/${productId}`);
    setSearchValue("");
    onClose();
  }

  return (
    <div className="absolute left-1/2 top-full z-50 w-full max-w-3xl -translate-x-1/2 px-4">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-xl px-6 py-4"
        >
          <input
            autoFocus
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Leita að garni, prjónum eða vörum..."
            className="w-full border-b border-stone-300 px-2 py-3 text-lg outline-none transition placeholder:text-stone-400 focus:border-stone-950"
          />
        </form>

        {searchValue.trim() && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
            {searchResults.length > 0 ? (
              <ul className="max-h-96 overflow-y-auto py-2">
                {searchResults.map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => handleProductClick(product.id)}
                      className="flex w-full items-center gap-4 px-4 py-3 text-left transition hover:bg-stone-50"
                    >
                      <div className="h-16 w-16 overflow-hidden rounded-xl bg-stone-100">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-stone-400">
                            Engin mynd
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-stone-950">
                          {product.name}
                        </p>

                        <p className="text-sm text-stone-500">
                          {product.price.toLocaleString("is-IS")} kr.
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-5 text-sm text-stone-500">
                Engar vörur fundust.
              </p>
            )}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium uppercase tracking-widest text-stone-500 hover:text-stone-950"
          >
            Loka leit
          </button>
        </div>
      </div>
    </div>
  );
}

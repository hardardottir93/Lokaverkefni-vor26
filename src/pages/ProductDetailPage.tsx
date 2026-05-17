import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../features/products/api/productsApi";

type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  location: string | null;
  condition: string | null;
  categories?: {
    id: string;
    name: string;
  } | null;
};

export function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        if (!id) return;

        const data = await getProductById(id);
        setProduct(data);
      } catch {
        setErrorMessage("Ekki tókst að sækja vöruna.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return <p className="p-6">Sæki vöru...</p>;
  }

  if (errorMessage) {
    return <p className="p-6 text-red-600">{errorMessage}</p>;
  }

  if (!product) {
    return <p className="p-6">Vara fannst ekki.</p>;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-gray-100">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.title}
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
            <h1 className="text-3xl font-bold text-gray-900">
              {product.title}
            </h1>

            <p className="mt-3 text-2xl font-semibold text-gray-900">
              {product.price.toLocaleString("is-IS")} kr.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            {product.condition && (
              <span className="rounded-full bg-gray-100 px-3 py-1">
                Ástand: {product.condition}
              </span>
            )}

            {product.location && (
              <span className="rounded-full bg-gray-100 px-3 py-1">
                Staðsetning: {product.location}
              </span>
            )}
          </div>

          {product.description && (
            <div>
              <h2 className="mb-2 text-lg font-semibold">Lýsing</h2>
              <p className="leading-7 text-gray-700">{product.description}</p>
            </div>
          )}

          <button
            type="button"
            className="w-full rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800 md:w-auto"
          >
            Bæta í körfu
          </button>
        </section>
      </div>
    </main>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCategories,
  type Category,
} from "../features/products/api/categoriesApi";

export function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const categoriesFromApi = await getCategories();
        setCategories(categoriesFromApi);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Something went wrong",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, []);

  return (
    <main className="bg-stone-50">
      <section className="mx-auto grid min-h-[70vh] max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            Netverslun fyrir handavinnu
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-950 md:text-5xl">
            Allt fyrir næsta prjónaverkefni á einum stað.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
            Skoðaðu garn, prjóna, heklunálar, uppskriftir og fylgihluti.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/products"
              className="rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              Skoða vörur
            </Link>

            <Link
              to="/cart"
              className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-900 transition hover:bg-white"
            >
              Karfa
            </Link>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="rounded-2xl bg-stone-100 p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
              Vöruflokkar
            </p>

            <h2 className="mt-2 text-2xl font-bold text-stone-950">
              Finndu það sem þig vantar
            </h2>

            {isLoading ? (
              <p className="mt-6 text-stone-600">Sæki vöruflokka...</p>
            ) : errorMessage ? (
              <p className="mt-6 text-red-600">Villa: {errorMessage}</p>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.slug}`}
                    className="rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <p className="font-semibold text-stone-950">
                      {category.name}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      Skoða vörur í þessum flokki
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

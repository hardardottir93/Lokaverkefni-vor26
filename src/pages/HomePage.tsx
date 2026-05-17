import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategories } from "../features/products/api/categoriesApi";
import type { Category } from "../features/products/model/product";

export function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        console.error("Ekki tókst að sækja flokka.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <main>
      <section className="relative min-h-[620px] overflow-hidden bg-stone-100">
        <div className="absolute inset-0">
          <img
            src="/images/yarn.jpg"
            alt="Garn og handverk"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        <div className="relative mx-auto flex min-h-[620px] max-w-6xl items-center px-4">
          <div className="max-w-xl text-white">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em]">
              Garn · Prjónar · Annað
            </p>

            <h1 className="text-5xl font-light leading-tight sm:text-6xl">
              Allt fyrir næsta verkefni
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-white/90">
              Skoðaðu fallegt úrval af garni, prjónum og fylgihlutum fyrir
              skapandi verkefni.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="rounded-full bg-white px-7 py-3 text-sm font-semibold uppercase tracking-widest text-stone-950 transition hover:bg-stone-950 hover:text-white"
              >
                Skoða vörur
              </Link>

              <Link
                to="/categories"
                className="rounded-full border border-white px-7 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-white hover:text-stone-950"
              >
                Skoða flokka
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-stone-500">
              Flokkar
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-stone-950">
              Verslaðu eftir flokki
            </h2>
          </div>

          <Link
            to="/products"
            className="hidden text-sm font-medium underline underline-offset-4 sm:inline"
          >
            Sjá allar vörur
          </Link>
        </div>

        {isLoading ? (
          <p className="text-stone-500">Sæki flokka...</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <p className="text-sm font-medium uppercase tracking-widest text-stone-400">
                  Flokkur
                </p>

                <h3 className="mt-3 text-xl font-semibold text-stone-950">
                  {category.name}
                </h3>

                <p className="mt-5 text-sm font-medium text-stone-600 group-hover:text-stone-950">
                  Skoða vörur →
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

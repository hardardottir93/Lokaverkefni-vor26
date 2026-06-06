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
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative mx-auto flex min-h-[620px] max-w-6xl items-center px-4 py-16">
          <div className="max-w-xl text-white">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em]">
              Garn · Prjónar · Uppskriftir
            </p>

            <h1 className="text-5xl font-light leading-tight sm:text-6xl">
              Allt fyrir næsta verkefni
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-white/90">
              Skoðaðu fallegt úrval af garni, prjónum, heklunálum, uppskriftum
              og aukahlutum fyrir skapandi verkefni.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="rounded-full bg-white px-7 py-3 text-sm font-semibold uppercase tracking-widest text-stone-950 transition hover:bg-stone-950 hover:text-white"
              >
                Skoða vörur
              </Link>

              <a
                href="#flokkar"
                className="rounded-full border border-white px-7 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-white hover:text-stone-950"
              >
                Skoða flokka
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="flokkar" className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
            Flokkar
          </p>

          <h2 className="mt-3 text-3xl font-light uppercase tracking-[0.12em] text-stone-950 sm:text-4xl">
            Veldu þitt næsta verkefni
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-stone-600">
            Finndu garn, prjóna, heklunálar, uppskriftir og aukahluti sem passa
            við það sem þú ert að fara að skapa.
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-stone-600">Sæki flokka...</p>
        ) : categories.length === 0 ? (
          <p className="rounded-2xl border border-stone-200 bg-stone-50 p-6 text-center text-stone-600">
            Engir flokkar fundust.
          </p>
        ) : (
          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const categoryDescriptions: Record<string, string> = {
                garn: "Mjúkt garn í fallegum litum fyrir peysur, húfur og smærri verkefni.",
                prjonar:
                  "Prjónar í vinsælum stærðum fyrir fjölbreytt handavinnuverkefni.",
                heklunalar:
                  "Heklunálar fyrir tuskur, teppi, dúkkur og skapandi hekl.",
                uppskriftir:
                  "Einfaldar og fallegar uppskriftir fyrir næsta verkefni.",
                aukahlutir:
                  "Allt litla dótið sem gerir handavinnuna þægilegri og skemmtilegri.",
              };

              const description =
                categoryDescriptions[category.slug] ??
                "Skoða vörur í þessum flokki.";

              return (
                <Link
                  key={category.id}
                  to={`/products?category=${category.slug}`}
                  className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-stone-400 hover:shadow-md"
                >
                  <div className="h-1 bg-stone-950" />

                  <div className="flex min-h-56 flex-col justify-between p-6">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.25em] text-stone-400">
                        Flokkur
                      </p>

                      <h3 className="mt-4 text-2xl font-semibold text-stone-950">
                        {category.name}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-stone-600">
                        {description}
                      </p>
                    </div>

                    <span className="mt-8 inline-flex items-center text-sm font-semibold text-stone-950">
                      Skoða vörur
                      <span className="ml-2 transition group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-4xl bg-stone-950 px-6 py-12 text-center text-white sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-stone-400">
            Tilbúin að byrja?
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-light leading-tight sm:text-4xl">
            Skoðaðu úrvalið og settu saman þína körfu
          </h2>

          <Link
            to="/products"
            className="mt-8 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold uppercase tracking-widest text-stone-950 transition hover:bg-stone-200"
          >
            Byrja að versla
          </Link>
        </div>
      </section>
    </main>
  );
}

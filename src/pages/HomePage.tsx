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
      <section className="relative min-h-85 overflow-hidden bg-stone-100">
        <div className="absolute inset-0">
          <img
            src="/images/yarn.jpg"
            alt="Garn og handverk"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative mx-auto flex min-h-85 max-w-6xl items-center px-4 py-12">
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
          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {categories.map((category) => {
              const categoryStyles: Record<
                string,
                {
                  icon: string;
                  description: string;
                  className: string;
                }
              > = {
                garn: {
                  icon: "🧶",
                  description:
                    "Mjúkt garn í fallegum litum fyrir peysur, húfur og smærri verkefni.",
                  className: "from-amber-50 to-orange-100",
                },
                prjonar: {
                  icon: "🪡",
                  description:
                    "Prjónar í vinsælum stærðum fyrir fjölbreytt handavinnuverkefni.",
                  className: "from-stone-50 to-stone-200",
                },
                heklunalar: {
                  icon: "✨",
                  description:
                    "Heklunálar fyrir tuskur, teppi, dúkkur og skapandi hekl.",
                  className: "from-rose-50 to-pink-100",
                },
                uppskriftir: {
                  icon: "📖",
                  description:
                    "Einfaldar og fallegar uppskriftir fyrir næsta verkefni.",
                  className: "from-sky-50 to-blue-100",
                },
                aukahlutir: {
                  icon: "🎀",
                  description:
                    "Allt litla dótið sem gerir handavinnuna þægilegri og skemmtilegri.",
                  className: "from-emerald-50 to-teal-100",
                },
              };

              const style = categoryStyles[category.slug] ?? {
                icon: "🧵",
                description: "Skoða vörur í þessum flokki.",
                className: "from-stone-50 to-stone-100",
              };

              return (
                <Link
                  key={category.id}
                  to={`/products?category=${category.slug}`}
                  className={`group relative min-h-56 overflow-hidden rounded-[1.75rem] bg-linear-to-br ${style.className} p-5 shadow-sm ring-1 ring-stone-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:last:col-span-2 sm:last:mx-auto sm:last:w-full lg:col-span-2 lg:nth-last-[-n+2]:col-span-3`}
                >
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/50 transition duration-300 group-hover:scale-125" />
                  <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-white/40" />

                  <div className="relative flex h-full flex-col">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-3xl shadow-sm">
                      {style.icon}
                    </div>

                    <div className="mt-6">
                      <h3 className="text-xl font-semibold text-stone-950">
                        {category.name}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-stone-600">
                        {style.description}
                      </p>
                    </div>

                    <span className="mt-auto pt-6 text-sm font-semibold text-stone-950">
                      Skoða vörur{" "}
                      <span className="inline-block transition group-hover:translate-x-1">
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

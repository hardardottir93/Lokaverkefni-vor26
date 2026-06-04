import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-stone-950 text-stone-100">
      <div className="mx-auto grid max-w-400 gap-10 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-2xl font-light uppercase tracking-[0.16em]">
            Prjónabúðin
          </h2>

          <p className="mt-3 max-w-sm text-sm leading-6 text-stone-300">
            Netverslun fyrir garn, prjóna, heklunálar, uppskriftir og fallega
            aukahluti fyrir handavinnuunnendur.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest">
            Verslun
          </h3>

          <nav className="mt-4 flex flex-col gap-2 text-sm text-stone-300">
            <Link to="/" className="transition hover:text-white">
              Heim
            </Link>
            <Link to="/products" className="transition hover:text-white">
              Vörur
            </Link>
            <Link to="/cart" className="transition hover:text-white">
              Karfa
            </Link>
            <Link to="/profile" className="transition hover:text-white">
              Mín síða
            </Link>
          </nav>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest">
            Upplýsingar
          </h3>

          <div className="mt-4 space-y-2 text-sm text-stone-300">
            <p>Prjónabúðin ehf.</p>
            <p>prjonabudin@prjonabudin.is</p>
            <p>Opið alla daga á netinu</p>
          </div>

          <p className="mt-4 text-xs leading-5 text-stone-400">
            Lokaverkefni - NTV - Vor 26.
          </p>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="mx-auto flex max-w-400 flex-col gap-2 px-4 py-4 text-xs text-stone-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} Prjónabúðin</p>
          <p>Lokaverkefni</p>
        </div>
      </div>
    </footer>
  );
}

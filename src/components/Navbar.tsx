import { Link, NavLink } from "react-router-dom";

export function Navbar() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold text-stone-950">
          Prjónabúðin
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-stone-950"
                : "text-stone-500 hover:text-stone-950"
            }
          >
            Heim
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? "text-stone-950"
                : "text-stone-500 hover:text-stone-950"
            }
          >
            Vörur
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive
                ? "text-stone-950"
                : "text-stone-500 hover:text-stone-950"
            }
          >
            Karfa
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? "text-stone-950"
                : "text-stone-500 hover:text-stone-950"
            }
          >
            Innskráning
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

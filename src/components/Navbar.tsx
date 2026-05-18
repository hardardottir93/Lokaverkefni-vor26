import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, Search, ShoppingBag, User, X } from "lucide-react";
import { SearchDropdown } from "./SearchDropdowwn";
import { useCartStore } from "../features/cart/store/cartStore";
import { useAuth } from "../features/auth/hooks/useAuth";
import { signOut } from "../features/auth/api/authApi";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `pb-1 text-xs font-medium uppercase tracking-widest transition hover:border-b hover:border-stone-950 md:text-sm ${
    isActive ? "border-b border-stone-950" : ""
  }`;

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, isLoggedIn } = useAuth();

  const cartItemCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  async function handleLogout() {
    await signOut();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white">
      <div className="relative">
        <nav className="mx-auto flex max-w-[1600px] flex-col px-4 py-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 lg:grid-cols-3">
            <div className="hidden items-center gap-6 lg:flex xl:gap-9">
              <NavLink to="/" className={navLinkClass}>
                Heim
              </NavLink>

              <NavLink to="/products" className={navLinkClass}>
                Vörur
              </NavLink>
            </div>

            <NavLink
              to="/"
              className="flex flex-col items-start lg:items-center"
            >
              <span className="text-2xl font-light uppercase tracking-[0.16em] text-stone-950 sm:text-3xl lg:text-4xl">
                Prjónabúðin
              </span>
              <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.28em] text-stone-600 sm:text-[10px]">
                Garn · Prjónar · Annað
              </span>
            </NavLink>

            <div className="flex items-center justify-end gap-4 text-stone-950 sm:gap-6">
              {isLoggedIn ? (
                <div className="hidden items-center gap-3 md:flex">
                  <span className="max-w-40 truncate text-xs text-stone-600">
                    {user?.email}
                  </span>

                  <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="Skrá út"
                    className="transition hover:text-stone-600"
                  >
                    <LogOut size={22} strokeWidth={1.5} />
                  </button>
                </div>
              ) : (
                <NavLink to="/login" aria-label="Innskráning">
                  <User size={22} strokeWidth={1.5} />
                </NavLink>
              )}

              <button
                type="button"
                aria-label="Leita"
                onClick={() => setIsSearchOpen((current) => !current)}
              >
                {isSearchOpen ? (
                  <X size={24} strokeWidth={1.5} />
                ) : (
                  <Search size={24} strokeWidth={1.5} />
                )}
              </button>

              <NavLink
                to="/cart"
                aria-label="Karfa"
                className="relative inline-flex items-center justify-center"
              >
                <ShoppingBag size={22} strokeWidth={1.5} />

                {cartItemCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-950 px-1 text-[10px] font-semibold leading-none text-white">
                    {cartItemCount}
                  </span>
                )}
              </NavLink>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-stone-100 pt-4 lg:hidden">
            <NavLink to="/" className={navLinkClass}>
              Heim
            </NavLink>

            <NavLink to="/products" className={navLinkClass}>
              Vörur
            </NavLink>
          </div>
        </nav>

        {isSearchOpen && (
          <SearchDropdown onClose={() => setIsSearchOpen(false)} />
        )}
      </div>
    </header>
  );
}

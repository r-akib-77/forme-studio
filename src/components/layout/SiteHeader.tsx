"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag } from "lucide-react";

import { navCollections } from "@/lib/data/collections";
import { useCart } from "@/components/providers/CartProvider";
import { useOverlay } from "@/components/providers/OverlayProvider";
import { Wordmark } from "@/components/ui/Wordmark";

export function SiteHeader() {
  const pathname = usePathname();
  const { totals, hydrated } = useCart();
  const { setCartOpen, setSearchOpen, setMobileNavOpen } = useOverlay();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/92 backdrop-blur-md supports-[backdrop-filter]:bg-paper/80">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-3 px-4 sm:h-16 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
          className="-ml-2 inline-flex h-10 w-10 items-center justify-center text-ink transition-colors hover:bg-bone lg:hidden"
        >
          <Menu className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
        </button>

        <Wordmark className="lg:min-w-[190px]" />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navCollections.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
                      active ? "text-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-0.5 left-0 h-px bg-ink transition-all duration-300 ${
                        active ? "w-full" : "w-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search products"
            className="inline-flex h-10 w-10 items-center justify-center text-ink transition-colors hover:bg-bone"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={1.7} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Open shopping bag, ${totals.itemCount} ${
              totals.itemCount === 1 ? "item" : "items"
            }`}
            className="relative inline-flex h-10 w-10 items-center justify-center text-ink transition-colors hover:bg-bone"
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.7} aria-hidden="true" />
            {hydrated && totals.itemCount > 0 ? (
              <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-lime px-1 text-[0.6rem] font-bold text-ink">
                {totals.itemCount > 99 ? "99+" : totals.itemCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}

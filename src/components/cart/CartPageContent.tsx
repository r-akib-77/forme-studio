"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCart } from "@/components/providers/CartProvider";

export function CartPageContent() {
  const { lines, totals, isEmpty, hydrated } = useCart();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-20 sm:px-6 lg:px-10">
        <div className="h-8 w-40 animate-pulse bg-bone" aria-hidden="true" />
        <div className="mt-8 space-y-4">
          {[0, 1].map((row) => (
            <div key={row} className="h-32 animate-pulse bg-bone" aria-hidden="true" />
          ))}
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        <p className="eyebrow mb-3">Your bag</p>
        <h1 className="display-md mb-10 text-ink">Shopping Bag</h1>
        <EmptyState
          icon={<ShoppingBag className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />}
          title="Your bag is empty"
          description="Nothing in here yet. Start with the current rotation — those pieces move fastest."
          action={
            <Link href="/collections/new-arrivals" className="btn btn-lime">
              Shop new arrivals
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
      <p className="eyebrow mb-3">Your bag</p>
      <h1 className="display-md text-ink">Shopping Bag</h1>
      <p className="mt-3 text-sm text-muted">
        {totals.itemCount} {totals.itemCount === 1 ? "piece" : "pieces"} ready to go.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7 xl:col-span-8">
          <ul className="divide-y divide-line border-y border-line">
            {lines.map((line) => (
              <CartItem key={line.lineId} line={line} />
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/collections/new-arrivals"
              className="group inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink"
            >
              <span className="link-underline">Continue shopping</span>
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            <p className="text-xs text-muted-2">Prices include all taxes and duties.</p>
          </div>
        </div>

        <aside className="lg:col-span-5 xl:col-span-4">
          <div className="border border-line bg-bone p-6 lg:sticky lg:top-24">
            <h2 className="eyebrow mb-5">Order summary</h2>
            <CartSummary>
              <div className="pt-2">
                <Link href="/checkout" className="btn btn-lime w-full">
                  Proceed to checkout
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
                <p className="mt-3 text-center text-[0.68rem] leading-relaxed text-muted-2">
                  Demo checkout — no payment is processed and no order is created.
                </p>
              </div>
            </CartSummary>
          </div>
        </aside>
      </div>
    </div>
  );
}

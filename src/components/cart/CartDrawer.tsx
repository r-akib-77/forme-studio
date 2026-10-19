"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShoppingBag, X } from "lucide-react";

import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/components/providers/CartProvider";
import { useOverlay } from "@/components/providers/OverlayProvider";
import { EmptyState } from "@/components/ui/EmptyState";

export function CartDrawer() {
  const { cartOpen, setCartOpen } = useOverlay();
  const { lines, totals, isEmpty } = useCart();
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cartOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCartOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    }, 140);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timer);
    };
  }, [cartOpen, setCartOpen]);

  return (
    <AnimatePresence>
      {cartOpen ? (
        <div className="fixed inset-0 z-[75]">
          <motion.button
            type="button"
            aria-label="Close shopping bag"
            onClick={() => setCartOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/45 backdrop-blur-[2px]"
          />
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[26rem] flex-col bg-paper shadow-[-30px_0_70px_-40px_rgba(0,0,0,0.55)]"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-baseline gap-2">
                <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
                  Your Bag
                </h2>
                <span className="text-xs text-muted">
                  {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close shopping bag"
                className="inline-flex h-9 w-9 items-center justify-center border border-line text-ink transition-colors hover:border-ink"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {isEmpty ? (
              <div className="flex flex-1 items-center px-5 py-10">
                <EmptyState
                  icon={<ShoppingBag className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />}
                  title="Your bag is empty"
                  description="Nothing here yet. Start with the pieces from the current rotation."
                  className="w-full"
                  action={
                    <Link
                      href="/collections/new-arrivals"
                      onClick={() => setCartOpen(false)}
                      className="btn btn-ink"
                    >
                      Shop new arrivals
                    </Link>
                  }
                />
              </div>
            ) : (
              <>
                <div className="scroll-quiet flex-1 overflow-y-auto px-5">
                  <ul className="divide-y divide-line">
                    {lines.map((line) => (
                      <CartItem key={line.lineId} line={line} />
                    ))}
                  </ul>
                </div>

                <div className="border-t border-line bg-paper px-5 py-5">
                  <CartSummary>
                    <div className="space-y-2 pt-1">
                      <Link
                        href="/checkout"
                        onClick={() => setCartOpen(false)}
                        className="btn btn-lime w-full"
                      >
                        Proceed to checkout
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                      <Link
                        href="/cart"
                        onClick={() => setCartOpen(false)}
                        className="btn btn-outline w-full"
                      >
                        View full bag
                      </Link>
                      <button
                        type="button"
                        onClick={() => setCartOpen(false)}
                        className="btn btn-ghost w-full text-muted"
                      >
                        Continue shopping
                      </button>
                    </div>
                  </CartSummary>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

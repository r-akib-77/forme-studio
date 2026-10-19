"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";

import { navCollections } from "@/lib/data/collections";
import { categories } from "@/lib/data/categories";
import { site } from "@/lib/data/site";
import { useOverlay } from "@/components/providers/OverlayProvider";

export function MobileNavigation() {
  const { mobileNavOpen, setMobileNavOpen } = useOverlay();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileNavOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    }, 120);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timer);
    };
  }, [mobileNavOpen, setMobileNavOpen]);

  useEffect(() => {
    setMobileNavOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <AnimatePresence>
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <motion.button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileNavOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/45 backdrop-blur-[2px]"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={reduceMotion ? { opacity: 0 } : { x: "-100%" }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: "-100%" }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="scroll-quiet absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col overflow-y-auto bg-paper"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <p className="eyebrow">Menu</p>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center border border-line text-ink transition-colors hover:border-ink"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile" className="px-5 py-6">
              <ul className="flex flex-col">
                {navCollections.map((item, index) => (
                  <li key={item.href} className="border-b border-line">
                    <Link
                      href={item.href}
                      className="flex items-center justify-between py-4 font-display text-2xl font-semibold tracking-tight text-ink"
                    >
                      {item.label}
                      <ArrowUpRight
                        className="h-4 w-4 text-muted-2"
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                    </Link>
                    {index === navCollections.length - 1 ? null : null}
                  </li>
                ))}
              </ul>

              <p className="eyebrow mt-8 mb-3">Shop by category</p>
              <ul className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/collections/${category.slug}`}
                      className="inline-flex items-center border border-line px-3 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-ink-2 transition-colors hover:border-ink hover:bg-bone"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-8 border-t border-line pt-6 text-xs leading-relaxed text-muted">
                <p className="font-semibold uppercase tracking-[0.16em] text-ink">{site.name}</p>
                <p className="mt-1">{site.location}</p>
                <p className="mt-3">
                  Demo storefront — contact details shown here are placeholder content.
                </p>
              </div>
            </nav>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

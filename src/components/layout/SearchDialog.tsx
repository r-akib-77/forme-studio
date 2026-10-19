"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";

import { products } from "@/lib/data/products";
import { productMatchesQuery } from "@/lib/filters";
import { formatBDT } from "@/lib/format";
import { useOverlay } from "@/components/providers/OverlayProvider";

const MAX_RESULTS = 6;

export function SearchDialog() {
  const { searchOpen, setSearchOpen } = useOverlay();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    return products.filter((product) => productMatchesQuery(product, trimmed)).slice(0, MAX_RESULTS);
  }, [query]);

  const totalMatches = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return 0;
    return products.filter((product) => productMatchesQuery(product, trimmed)).length;
  }, [query]);

  useEffect(() => {
    if (!searchOpen) return;
    setQuery("");
    setActiveIndex(0);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [searchOpen, setSearchOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function goToResults() {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!results.length) {
      if (event.key === "Enter") goToResults();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = results[activeIndex];
      if (target) {
        setSearchOpen(false);
        router.push(`/products/${target.slug}`);
      }
    }
  }

  return (
    <AnimatePresence>
      {searchOpen ? (
        <div className="fixed inset-0 z-[80]">
          <motion.button
            type="button"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/45 backdrop-blur-[3px]"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -18 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -18 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden border border-line bg-paper shadow-[0_40px_90px_-40px_rgba(0,0,0,0.55)] sm:mt-[8vh]"
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
              <Search className="h-[18px] w-[18px] shrink-0 text-muted" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search tees, jerseys, cargo pants…"
                aria-label="Search products"
                className="h-9 w-full bg-transparent text-[0.95rem] text-ink outline-none placeholder:text-muted-2"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-line text-ink transition-colors hover:border-ink"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="scroll-quiet flex-1 overflow-y-auto">
              {query.trim() === "" ? (
                <div className="px-5 py-8">
                  <p className="eyebrow mb-4">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {["Heavyweight tee", "Oversized", "Jersey", "Cargo", "Oxford shirt", "Cap"].map(
                      (term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setQuery(term)}
                          className="border border-line px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink-2 transition-colors hover:border-ink hover:bg-bone"
                        >
                          {term}
                        </button>
                      ),
                    )}
                  </div>
                  <p className="mt-8 max-w-sm text-xs leading-relaxed text-muted">
                    Search matches product names, categories, colours, sizes and studio tags.
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <p className="font-display text-xl font-semibold text-ink">
                    No results for “{query.trim()}”
                  </p>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                    Try a shorter term, a category such as “jerseys”, or a colour like “ink”.
                  </p>
                </div>
              ) : (
                <ul ref={listRef} className="divide-y divide-line">
                  {results.map((product, index) => (
                    <li key={product.id}>
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={() => setSearchOpen(false)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`flex items-center gap-4 px-4 py-3 transition-colors sm:px-5 ${
                          index === activeIndex ? "bg-bone" : "bg-paper hover:bg-bone"
                        }`}
                      >
                        <span className="media-frame relative h-16 w-12 shrink-0">
                          <Image
                            src={product.images[0]}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-ink">
                            {product.name}
                          </span>
                          <span className="mt-0.5 block truncate text-xs capitalize text-muted">
                            {product.category.replace("-", " ")} · {product.colors.length} colours
                          </span>
                        </span>
                        <span className="shrink-0 text-sm font-medium text-ink">
                          {formatBDT(product.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {query.trim() !== "" ? (
              <div className="border-t border-line px-4 py-3 sm:px-5">
                <button
                  type="button"
                  onClick={goToResults}
                  className="group flex w-full items-center justify-between text-left"
                >
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink">
                    {totalMatches > 0
                      ? `View all ${totalMatches} result${totalMatches === 1 ? "" : "s"}`
                      : "Browse the full catalogue"}
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-ink transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>
              </div>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";

import { FilterPanel } from "@/components/catalog/FilterPanel";
import { SortControl } from "@/components/catalog/SortControl";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { PackageSearch } from "lucide-react";
import {
  activeFilterCount,
  applyFilters,
  categoryFacets,
  emptyFilters,
  priceCeiling as computeCeiling,
  sortProducts,
  uniqueValues,
  type FilterState,
  type SortKey,
} from "@/lib/filters";
import type { Product } from "@/lib/data/types";

type CatalogViewProps = {
  products: Product[];
  title: string;
  description: string;
  eyebrow?: string;
  /** Optional locked category, used by the category pages. */
  lockedCategory?: string;
  /** Search query applied on top of the catalogue. */
  query?: string;
};

export function CatalogView({
  products,
  title,
  description,
  eyebrow,
  lockedCategory,
  query = "",
}: CatalogViewProps) {
  const reduceMotion = useReducedMotion();
  const [filters, setFilters] = useState<FilterState>({
    ...emptyFilters,
    categories: lockedCategory ? [lockedCategory] : [],
    query,
  });
  const [sort, setSort] = useState<SortKey>("featured");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const ceiling = useMemo(() => computeCeiling(products), [products]);

  // Keep the view in sync when the URL query changes (search page navigation).
  useEffect(() => {
    setFilters((current) =>
      current.query === query ? current : { ...current, query },
    );
  }, [query]);

  useEffect(() => {
    if (!lockedCategory) return;
    setFilters((current) =>
      current.categories.length === 1 && current.categories[0] === lockedCategory
        ? current
        : { ...current, categories: [lockedCategory] },
    );
  }, [lockedCategory]);

  const facets = useMemo(
    () => ({
      categories: categoryFacets(products),
      sizes: uniqueValues(products, "sizes"),
      colors: uniqueValues(products, "colors"),
    }),
    [products],
  );

  const visible = useMemo(() => {
    const filtered = applyFilters(products, { ...filters, maxPrice: Math.min(filters.maxPrice, ceiling) });
    return sortProducts(filtered, sort);
  }, [products, filters, sort, ceiling]);

  const chipCount = activeFilterCount(filters);

  function clearAll() {
    setFilters({
      ...emptyFilters,
      categories: lockedCategory ? [lockedCategory] : [],
      query,
    });
  }

  const chips: { key: string; label: string; onRemove: () => void }[] = [
    ...filters.categories.map((category) => ({
      key: `cat-${category}`,
      label: category.replace("-", " "),
      onRemove: () =>
        setFilters((current) => ({
          ...current,
          categories: current.categories.filter((c) => c !== category),
        })),
    })),
    ...filters.sizes.map((size) => ({
      key: `size-${size}`,
      label: `Size ${size}`,
      onRemove: () =>
        setFilters((current) => ({
          ...current,
          sizes: current.sizes.filter((s) => s !== size),
        })),
    })),
    ...filters.colors.map((color) => ({
      key: `color-${color}`,
      label: color,
      onRemove: () =>
        setFilters((current) => ({
          ...current,
          colors: current.colors.filter((c) => c !== color),
        })),
    })),
  ];

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:px-10">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-[0.66rem] uppercase tracking-[0.16em] text-muted">
          <li>
            <Link href="/" className="transition-colors hover:text-ink">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-muted-2">
            /
          </li>
          <li className="text-ink">{title}</li>
        </ol>
      </nav>

      <header className="max-w-2xl">
        {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
        <h1 className="display-lg text-ink">{title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
          {description}
        </p>
      </header>

      <div className="mt-8 flex flex-wrap items-center gap-y-3 border-y border-line py-3 lg:py-3.5">
        <p className="w-full text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink lg:w-auto lg:mr-auto">
          {visible.length} {visible.length === 1 ? "piece" : "pieces"}
          {query ? ` for “${query}”` : ""}
        </p>

        <div className="flex w-full items-center gap-2 lg:w-auto">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 border border-line px-3 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink lg:hidden"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
            Filters
            {chipCount > 0 ? (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-lime px-1 text-[0.58rem] font-bold text-ink">
                {chipCount}
              </span>
            ) : null}
          </button>
          <SortControl value={sort} onChange={setSort} />
        </div>
      </div>

      {chips.length > 0 ? (
        <ul className="mt-4 flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <li key={chip.key}>
              <button
                type="button"
                onClick={chip.onRemove}
                className="inline-flex items-center gap-1.5 border border-line bg-bone px-2.5 py-1.5 text-[0.66rem] font-medium capitalize text-ink-2 transition-colors hover:border-ink"
              >
                {chip.label}
                <X className="h-3 w-3" aria-hidden="true" />
                <span className="sr-only">Remove filter</span>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={clearAll}
              className="px-1 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted underline underline-offset-4 transition-colors hover:text-ink"
            >
              Clear all
            </button>
          </li>
        </ul>
      ) : null}

      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-12">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
            <FilterPanel
              filters={filters}
              facets={facets}
              priceCeiling={ceiling}
              resultCount={visible.length}
              onChange={setFilters}
              onClear={clearAll}
            />
          </div>
        </aside>

        <div>
          {visible.length > 0 ? (
            <ProductGrid products={visible} columns={4} priorityCount={4} />
          ) : (
            <EmptyState
              icon={<PackageSearch className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />}
              title="Nothing matches those filters"
              description="Try widening the price range or removing a colour to see more of the range."
              action={
                <button type="button" onClick={clearAll} className="btn btn-ink">
                  Reset filters
                </button>
              }
            />
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawerOpen ? (
          <div className="fixed inset-0 z-[75] lg:hidden">
            <motion.button
              type="button"
              aria-label="Close filters"
              onClick={() => setDrawerOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="absolute inset-0 h-full w-full cursor-default bg-ink/45"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Product filters"
              initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
              animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 right-0 flex w-full max-w-[22rem] flex-col bg-paper"
            >
              <FilterPanel
                filters={filters}
                facets={facets}
                priceCeiling={ceiling}
                resultCount={visible.length}
                onChange={setFilters}
                onClear={clearAll}
                onClose={() => setDrawerOpen(false)}
              />
              <div className="border-t border-line p-4">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="btn btn-lime w-full"
                >
                  Show {visible.length} {visible.length === 1 ? "result" : "results"}
                </button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

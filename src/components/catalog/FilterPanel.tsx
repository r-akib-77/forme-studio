"use client";

import { X } from "lucide-react";

import { formatBDT } from "@/lib/format";
import type { Facet, FilterState } from "@/lib/filters";

type FilterPanelProps = {
  filters: FilterState;
  facets: {
    categories: Facet[];
    sizes: Facet[];
    colors: Facet[];
  };
  priceCeiling: number;
  resultCount: number;
  onChange: (next: FilterState) => void;
  onClear: () => void;
  onClose?: () => void;
};

function toggle(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function FilterPanel({
  filters,
  facets,
  priceCeiling,
  resultCount,
  onChange,
  onClear,
  onClose,
}: FilterPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
            Filters
          </h2>
          <p className="mt-0.5 text-[0.68rem] uppercase tracking-[0.14em] text-muted">
            {resultCount} {resultCount === 1 ? "result" : "results"}
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="inline-flex h-9 w-9 items-center justify-center border border-line text-ink transition-colors hover:border-ink"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="scroll-quiet flex-1 overflow-y-auto px-5 py-5">
        {/* Category */}
        <fieldset className="border-b border-line pb-6">
          <legend className="eyebrow mb-3.5">Category</legend>
          <ul className="space-y-2.5">
            {facets.categories.map((facet) => {
              const checked = filters.categories.includes(facet.value);
              return (
                <li key={facet.value}>
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-ink-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        onChange({
                          ...filters,
                          categories: toggle(filters.categories, facet.value),
                        })
                      }
                      className="h-4 w-4 shrink-0 appearance-none border border-line-strong bg-paper transition-colors checked:border-ink checked:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                      style={
                        checked
                          ? {
                              backgroundImage:
                                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2 6.2 4.7 9 10 3.2' fill='none' stroke='%23c8f000' stroke-width='1.8' stroke-linecap='square'/%3E%3C/svg%3E\")",
                              backgroundSize: "100%",
                            }
                          : undefined
                      }
                    />
                    <span className="flex-1 capitalize">{facet.label}</span>
                    <span className="text-xs text-muted-2">{facet.count}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>

        {/* Price */}
        <fieldset className="border-b border-line py-6">
          <legend className="eyebrow mb-3.5">Max price</legend>
          <input
            type="range"
            min={500}
            max={priceCeiling}
            step={100}
            value={Math.min(filters.maxPrice, priceCeiling)}
            onChange={(event) =>
              onChange({ ...filters, maxPrice: Number(event.target.value) })
            }
            aria-label="Maximum price"
            className="h-1 w-full cursor-pointer appearance-none rounded-none bg-clay accent-ink"
          />
          <div className="mt-3 flex items-center justify-between text-xs text-muted">
            <span>৳500</span>
            <span className="font-semibold text-ink">
              Up to {formatBDT(Math.min(filters.maxPrice, priceCeiling))}
            </span>
          </div>
        </fieldset>

        {/* Size */}
        {facets.sizes.length ? (
          <fieldset className="border-b border-line py-6">
            <legend className="eyebrow mb-3.5">Size</legend>
            <div className="flex flex-wrap gap-2">
              {facets.sizes.map((facet) => {
                const active = filters.sizes.includes(facet.value);
                return (
                  <button
                    key={facet.value}
                    type="button"
                    onClick={() =>
                      onChange({ ...filters, sizes: toggle(filters.sizes, facet.value) })
                    }
                    aria-pressed={active}
                    className={`min-w-11 border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.1em] transition-colors ${
                      active
                        ? "border-ink bg-ink text-paper"
                        : "border-line text-ink-2 hover:border-ink"
                    }`}
                  >
                    {facet.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ) : null}

        {/* Colour */}
        {facets.colors.length ? (
          <fieldset className="py-6">
            <legend className="eyebrow mb-3.5">Colour</legend>
            <ul className="flex flex-wrap gap-2">
              {facets.colors.map((facet) => {
                const active = filters.colors.includes(facet.value);
                return (
                  <li key={facet.value}>
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          ...filters,
                          colors: toggle(filters.colors, facet.value),
                        })
                      }
                      aria-pressed={active}
                      className={`flex items-center gap-2 border px-2.5 py-1.5 text-[0.68rem] font-medium transition-colors ${
                        active
                          ? "border-ink bg-bone text-ink"
                          : "border-line text-ink-2 hover:border-ink"
                      }`}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-line-strong"
                        style={{ backgroundColor: facet.hex }}
                        aria-hidden="true"
                      />
                      {facet.label}
                      <span className="text-muted-2">{facet.count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        ) : null}
      </div>

      <div className="border-t border-line px-5 py-4">
        <button type="button" onClick={onClear} className="btn btn-outline w-full">
          Clear all filters
        </button>
      </div>
    </div>
  );
}

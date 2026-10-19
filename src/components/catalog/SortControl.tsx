"use client";

import { ChevronDown } from "lucide-react";

import { sortOptions, type SortKey } from "@/lib/filters";

/**
 * The native <select> can only contain text, so the options carry the short
 * wording on every breakpoint. Full labels live on `aria-label` / `title`.
 */
const shortLabels: Record<SortKey, string> = {
  featured: "Featured",
  newest: "Newest",
  "price-asc": "Price: Low",
  "price-desc": "Price: High",
};

export function SortControl({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (next: SortKey) => void;
}) {
  const current = sortOptions.find((option) => option.value === value);

  return (
    <div className="relative shrink-0">
      <label htmlFor="sort-select" className="sr-only">
        Sort products
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(event) => onChange(event.target.value as SortKey)}
        title={current?.label}
        aria-label={`Sort products — ${current?.label}`}
        className="h-10 cursor-pointer appearance-none border border-line bg-paper pl-3 pr-8 text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-ink outline-none transition-colors hover:border-ink focus-visible:border-ink sm:pl-3.5 sm:text-[0.68rem] sm:tracking-[0.14em]"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {shortLabels[option.value]}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 text-muted"
        aria-hidden="true"
      />
    </div>
  );
}

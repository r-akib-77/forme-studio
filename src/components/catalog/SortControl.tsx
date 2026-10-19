"use client";

import { ChevronDown } from "lucide-react";

import { sortOptions, type SortKey } from "@/lib/filters";

export function SortControl({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (next: SortKey) => void;
}) {
  return (
    <div className="relative">
      <label htmlFor="sort-select" className="sr-only">
        Sort products
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(event) => onChange(event.target.value as SortKey)}
        className="h-10 cursor-pointer appearance-none border border-line bg-paper pl-3.5 pr-9 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink outline-none transition-colors hover:border-ink focus-visible:border-ink"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
    </div>
  );
}

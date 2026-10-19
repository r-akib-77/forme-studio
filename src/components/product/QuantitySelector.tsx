"use client";

import { Minus, Plus } from "lucide-react";

export function QuantitySelector({
  value,
  onChange,
  max = 10,
  min = 1,
  label = "Quantity",
}: {
  value: number;
  onChange: (next: number) => void;
  max?: number;
  min?: number;
  label?: string;
}) {
  return (
    <div>
      <span className="eyebrow mb-2.5 block">{label}</span>
      <div className="inline-flex items-center border border-line">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label="Decrease quantity"
          className="inline-flex h-11 w-11 items-center justify-center text-ink transition-colors hover:bg-bone disabled:opacity-30"
        >
          <Minus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
        </button>
        <span
          aria-live="polite"
          className="w-12 text-center text-sm font-semibold tabular-nums text-ink"
        >
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label="Increase quantity"
          className="inline-flex h-11 w-11 items-center justify-center text-ink transition-colors hover:bg-bone disabled:opacity-30"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

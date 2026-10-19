"use client";

export function VariantSelector({
  label,
  options,
  value,
  onChange,
  disabledValues = [],
  swatches = false,
  hint,
}: {
  label: string;
  options: { value: string; label: string; hex?: string }[];
  value: string;
  onChange: (next: string) => void;
  disabledValues?: string[];
  swatches?: boolean;
  hint?: string;
}) {
  return (
    <fieldset>
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <legend className="eyebrow">{label}</legend>
        {value ? (
          <span className="text-[0.72rem] font-medium capitalize text-ink">{value}</span>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const disabled = disabledValues.includes(option.value);
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              title={disabled ? `${option.label} — unavailable` : option.label}
              className={`relative inline-flex items-center justify-center gap-2 border px-3.5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] transition-colors ${
                disabled
                  ? "cursor-not-allowed border-line text-muted-2 line-through"
                  : selected
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-ink-2 hover:border-ink"
              }`}
            >
              {swatches ? (
                <span
                  className="h-3.5 w-3.5 rounded-full border border-line-strong"
                  style={{ backgroundColor: option.hex }}
                  aria-hidden="true"
                />
              ) : null}
              {option.label}
            </button>
          );
        })}
      </div>

      {hint ? <p className="mt-2 text-xs text-muted">{hint}</p> : null}
    </fieldset>
  );
}

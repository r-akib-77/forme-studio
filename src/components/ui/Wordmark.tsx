import Link from "next/link";

/** The FORME STUDIO mark — a solid disc with a lime quarter, echoing the accent. */
export function BrandMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d="M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21Z" fill="currentColor" />
      <path d="M12 12v10.5A10.5 10.5 0 0 1 1.5 12H12Z" fill="var(--color-lime)" />
    </svg>
  );
}

export function Wordmark({
  className = "",
  markClassName = "h-[18px] w-[18px]",
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 text-ink ${className}`}
      aria-label="FORME STUDIO — home"
    >
      <BrandMark className={markClassName} />
      <span className="flex items-baseline gap-2 leading-none">
        <span className="font-display text-[1.06rem] font-semibold tracking-[-0.01em]">
          FORME
        </span>
        <span className="hidden h-3 w-px bg-line-strong sm:block" aria-hidden="true" />
        <span className="hidden text-[0.56rem] font-semibold tracking-[0.34em] text-muted sm:inline">
          STUDIO
        </span>
      </span>
    </Link>
  );
}

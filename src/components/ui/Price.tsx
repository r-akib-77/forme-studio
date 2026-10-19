import type { ReactNode } from "react";

import { discountPercent, formatBDT } from "@/lib/format";

export function Price({
  price,
  compareAtPrice,
  size = "sm",
  className = "",
}: {
  price: number;
  compareAtPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const scale = {
    sm: "text-[0.82rem]",
    md: "text-[0.95rem]",
    lg: "text-lg",
  }[size];

  const hasDiscount = discountPercent(price, compareAtPrice) > 0;

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 ${scale} ${className}`}>
      <span className={hasDiscount ? "text-ink" : "text-ink"}>{formatBDT(price)}</span>
      {hasDiscount ? (
        <>
          <span className="text-muted-2 line-through">{formatBDT(compareAtPrice!)}</span>
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-lime-ink">
            −{discountPercent(price, compareAtPrice)}%
          </span>
        </>
      ) : null}
    </span>
  );
}

export function Badge({
  children,
  tone = "ink",
  className = "",
}: {
  children: ReactNode;
  tone?: "ink" | "lime" | "outline" | "muted" | "paper";
  className?: string;
}) {
  const tones = {
    ink: "bg-ink text-paper",
    lime: "bg-lime text-ink",
    outline: "border border-ink/25 text-ink",
    muted: "bg-sand text-ink-2",
    paper: "bg-paper text-ink",
  }[tone];

  return (
    <span
      className={`inline-flex items-center px-2 py-[3px] text-[0.58rem] font-semibold uppercase tracking-[0.16em] ${tones} ${className}`}
    >
      {children}
    </span>
  );
}

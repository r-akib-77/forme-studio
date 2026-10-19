"use client";

import { Truck } from "lucide-react";

import { useCart } from "@/components/providers/CartProvider";
import { deliveryInfo } from "@/lib/data/site";
import { formatBDT } from "@/lib/format";

export function CartSummary({
  compact = false,
  children,
}: {
  compact?: boolean;
  children?: React.ReactNode;
}) {
  const { totals } = useCart();
  const progress = Math.min(
    100,
    (totals.subtotal / deliveryInfo.freeDeliveryThreshold) * 100,
  );

  return (
    <div className="space-y-4">
      {!compact ? (
        <div className="border border-line bg-bone px-4 py-3.5">
          <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink">
            <Truck className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
            {totals.qualifiesForFreeDelivery
              ? "Free delivery unlocked"
              : `${formatBDT(totals.freeDeliveryRemaining)} away from free delivery`}
          </div>
          <div
            className="mt-2.5 h-[3px] w-full bg-clay"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={deliveryInfo.freeDeliveryThreshold}
            aria-valuenow={Math.min(totals.subtotal, deliveryInfo.freeDeliveryThreshold)}
            aria-label="Progress towards free delivery"
          >
            <div
              className="h-full bg-ink transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : null}

      <dl className="space-y-2.5 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="font-medium tabular-nums text-ink">{formatBDT(totals.subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">Delivery</dt>
          <dd className="font-medium tabular-nums text-ink">
            {totals.deliveryFee === 0 ? "Free" : formatBDT(totals.deliveryFee)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-line pt-3">
          <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink">
            Total
          </dt>
          <dd className="font-display text-xl font-semibold tabular-nums text-ink">
            {formatBDT(totals.total)}
          </dd>
        </div>
      </dl>

      {children}
    </div>
  );
}

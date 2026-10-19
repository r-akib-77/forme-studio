"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MapPin } from "lucide-react";

import { formatBDT } from "@/lib/format";
import { deliveryInfo } from "@/lib/data/site";
import type { CartLine } from "@/components/providers/CartProvider";
import type { CheckoutValues } from "@/lib/checkout";

export function OrderConfirmation({
  reference,
  values,
  payment,
  lines,
}: {
  reference: string;
  values: CheckoutValues;
  payment: string;
  lines: CartLine[];
}) {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const baseDelivery = deliveryInfo.insideDhaka;
  const deliveryFee =
    subtotal === 0 || subtotal >= deliveryInfo.freeDeliveryThreshold ? 0 : baseDelivery;
  const total = subtotal + deliveryFee;

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
      <div className="border border-line bg-paper">
        <div className="border-b border-line bg-bone px-6 py-8 text-center sm:px-10">
          <span className="mx-auto flex h-12 w-12 items-center justify-center bg-lime text-ink">
            <Check className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
          </span>
          <p className="eyebrow mt-5">Demo order confirmed</p>
          <h1 className="display-md mt-3 text-ink">Thanks, {values.name.trim().split(" ")[0]}.</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            Here is a preview of what a real confirmation would look like.
          </p>
          <p className="mt-6 inline-flex flex-col items-center gap-1 border border-ink bg-ink px-6 py-3 text-paper">
            <span className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-paper/60">
              Demo reference
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">{reference}</span>
          </p>
        </div>

        <div className="border-b border-line px-6 py-6 sm:px-10">
          <h2 className="eyebrow mb-4">Delivery details</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">Name</dt>
              <dd className="mt-0.5 text-ink">{values.name}</dd>
            </div>
            <div>
              <dt className="text-muted">Phone</dt>
              <dd className="mt-0.5 text-ink">{values.phone}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted">Address</dt>
              <dd className="mt-0.5 flex items-start gap-2 text-ink">
                <MapPin
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime-ink"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
                <span>
                  {values.address}, {values.district}
                </span>
              </dd>
            </div>
            {values.note.trim() ? (
              <div className="sm:col-span-2">
                <dt className="text-muted">Order note</dt>
                <dd className="mt-0.5 text-ink">{values.note}</dd>
              </div>
            ) : null}
            <div className="sm:col-span-2">
              <dt className="text-muted">Payment method</dt>
              <dd className="mt-0.5 text-ink">{payment}</dd>
            </div>
          </dl>
        </div>

        <div className="px-6 py-6 sm:px-10">
          <h2 className="eyebrow mb-4">Order summary</h2>
          <ul className="divide-y divide-line border-y border-line">
            {lines.map((line) => (
              <li key={line.lineId} className="flex items-center gap-4 py-3.5">
                <span className="media-frame relative h-16 w-12 shrink-0">
                  <Image
                    src={line.image}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink">
                    {line.name}
                  </span>
                  <span className="mt-0.5 block text-[0.68rem] uppercase tracking-[0.12em] text-muted">
                    {line.color} · Size {line.size} · Qty {line.quantity}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-medium tabular-nums text-ink">
                  {formatBDT(line.price * line.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-medium tabular-nums text-ink">{formatBDT(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Demo delivery</dt>
              <dd className="font-medium tabular-nums text-ink">
                {deliveryFee === 0 ? "Free" : formatBDT(deliveryFee)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-line pt-3">
              <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink">
                Total payable
              </dt>
              <dd className="font-display text-xl font-semibold tabular-nums text-ink">
                {formatBDT(total)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="border-t border-line bg-bone px-6 py-6 sm:px-10">
          <p className="text-xs leading-relaxed text-muted">
            <strong className="font-semibold text-ink">This was a demonstration.</strong> No
            order has been created, no payment has been taken and no personal information
            has been transmitted anywhere. The reference number above was generated in your
            browser.
          </p>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <Link href="/collections/new-arrivals" className="btn btn-lime">
              Keep shopping
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link href="/" className="btn btn-outline">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

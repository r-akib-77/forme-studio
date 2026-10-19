"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { useCart, type CartLine } from "@/components/providers/CartProvider";
import { formatBDT } from "@/lib/format";

export function CartItem({ line }: { line: CartLine }) {
  const { setQuantity, removeItem } = useCart();

  return (
    <li className="flex gap-4 py-5">
      <Link
        href={`/products/${line.slug}`}
        className="media-frame relative h-28 w-20 shrink-0 sm:h-32 sm:w-24"
      >
        <Image
          src={line.image}
          alt={line.name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[0.84rem] font-medium text-ink">
              <Link href={`/products/${line.slug}`} className="link-underline">
                {line.name}
              </Link>
            </h3>
            <p className="mt-1 text-[0.7rem] uppercase tracking-[0.12em] text-muted">
              {line.color} · Size {line.size}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(line.lineId)}
            aria-label={`Remove ${line.name} from bag`}
            className="-mr-1 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center text-muted-2 transition-colors hover:text-ink"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className="flex items-center border border-line">
            <button
              type="button"
              onClick={() => setQuantity(line.lineId, line.quantity - 1)}
              aria-label={`Decrease quantity of ${line.name}`}
              className="inline-flex h-8 w-8 items-center justify-center text-ink transition-colors hover:bg-bone"
            >
              <Minus className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
            </button>
            <span
              aria-live="polite"
              className="w-8 text-center text-xs font-semibold tabular-nums text-ink"
            >
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(line.lineId, line.quantity + 1)}
              disabled={line.quantity >= 10}
              aria-label={`Increase quantity of ${line.name}`}
              className="inline-flex h-8 w-8 items-center justify-center text-ink transition-colors hover:bg-bone disabled:opacity-30"
            >
              <Plus className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          <p className="text-sm font-medium tabular-nums text-ink">
            {formatBDT(line.price * line.quantity)}
          </p>
        </div>
      </div>
    </li>
  );
}

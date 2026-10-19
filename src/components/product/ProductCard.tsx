"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Plus, Check } from "lucide-react";

import { Badge, Price } from "@/components/ui/Price";
import { useCart } from "@/components/providers/CartProvider";
import { useOverlay } from "@/components/providers/OverlayProvider";
import type { Product } from "@/lib/data/types";

export function ProductCard({
  product,
  priority = false,
  className = "",
}: {
  product: Product;
  priority?: boolean;
  className?: string;
}) {
  const { addItem } = useCart();
  const { notify } = useOverlay();
  const [pickingSize, setPickingSize] = useState(false);

  const hasMultipleSizes = product.sizes.length > 1;
  const secondaryImage = product.images[1] ?? product.images[0];

  function quickAdd(size?: string) {
    if (!size) {
      setPickingSize(true);
      return;
    }
    addItem({
      productId: product.id,
      size,
      color: product.colors[0]?.name ?? "",
      quantity: 1,
    });
    setPickingSize(false);
    notify({
      title: "Added to bag",
      description: `${product.name} — ${size}`,
      image: product.images[0],
    });
  }

  return (
    <article className={`group relative flex flex-col ${className}`}>
      <div className="relative">
        <Link
          href={`/products/${product.slug}`}
          className="media-frame block aspect-[4/5] w-full"
          aria-label={`${product.name} — view details`}
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover"
          />
          {secondaryImage !== product.images[0] ? (
            <Image
              src={secondaryImage}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
            />
          ) : null}
        </Link>

        <div className="pointer-events-none absolute left-0 top-0 flex flex-col items-start gap-1 p-2.5 sm:top-3 sm:left-3 sm:gap-1.5">
          {product.isNew ? <Badge tone="lime">New</Badge> : null}
          {product.bestseller ? <Badge tone="ink">Bestseller</Badge> : null}
          {product.stock === "low-stock" ? (
            <Badge tone="paper">Only {product.unitsLeft} left</Badge>
          ) : null}
          {product.stock === "out-of-stock" ? (
            <Badge tone="paper">Sold out</Badge>
          ) : null}
        </div>

        {product.stock !== "out-of-stock" ? (
          <div className="absolute bottom-3 right-3">
            {pickingSize && hasMultipleSizes ? (
              <div className="flex items-center gap-1 border border-line bg-paper/95 p-1 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6)] backdrop-blur-sm">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => quickAdd(size)}
                    className="min-w-8 px-1.5 py-1.5 text-[0.65rem] font-semibold tracking-wider text-ink transition-colors hover:bg-ink hover:text-paper"
                  >
                    {size}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPickingSize(false)}
                  className="px-1.5 py-1.5 text-[0.6rem] font-semibold uppercase tracking-wider text-muted hover:text-ink"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => quickAdd()}
                aria-label={`Quick add ${product.name} to bag`}
                className="flex h-9 w-9 items-center justify-center bg-ink text-paper opacity-100 transition-all duration-300 hover:bg-lime hover:text-ink sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[0.84rem] font-medium leading-snug text-ink">
            <Link href={`/products/${product.slug}`} className="link-underline">
              {product.name}
            </Link>
          </h3>
          {product.stock === "out-of-stock" ? (
            <span className="shrink-0 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-2">
              Sold out
            </span>
          ) : null}
        </div>

        <Price price={product.price} compareAtPrice={product.compareAtPrice} />

        {product.colors.length > 1 ? (
          <ul className="mt-1 flex flex-wrap items-center gap-1.5" aria-label="Available colours">
            {product.colors.slice(0, 5).map((color) => (
              <li
                key={color.name}
                title={color.name}
                className="h-3 w-3 rounded-full border border-line-strong"
                style={{ backgroundColor: color.hex }}
              >
                <span className="sr-only">{color.name}</span>
              </li>
            ))}
            {product.colors.length > 5 ? (
              <li className="text-[0.62rem] text-muted-2">+{product.colors.length - 5}</li>
            ) : null}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

/** Compact variant used inside the cart drawer and the cart page. */
export function AddedIndicator({ label = "Added" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-lime-ink">
      <Check className="h-3 w-3" aria-hidden="true" />
      {label}
    </span>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ShoppingBag, Zap } from "lucide-react";

import { QuantitySelector } from "@/components/product/QuantitySelector";
import { VariantSelector } from "@/components/product/VariantSelector";
import { useCart } from "@/components/providers/CartProvider";
import { useOverlay } from "@/components/providers/OverlayProvider";
import { Price } from "@/components/ui/Price";
import { deliveryInfo } from "@/lib/data/site";
import type { Product } from "@/lib/data/types";
import { formatBDT } from "@/lib/format";

/** Sizes that are genuinely sold out on specific pieces in the mock data. */
const UNAVAILABLE_SIZES: Record<string, string[]> = {
  "fms-tee-005": ["XS"],
  "fms-tee-009": ["S"],
  "fms-tee-011": ["XXL"],
  "fms-ovr-010": ["XXL"],
  "fms-shr-017": ["S"],
  "fms-btm-020": ["38"],
  "fms-btm-021": ["36"],
  "fms-acc-025": [],
};

export function ProductPurchasePanel({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { notify, setCartOpen } = useOverlay();

  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  const isSoldOut = product.stock === "out-of-stock";
  const disabledSizes = (UNAVAILABLE_SIZES[product.id] ?? []).filter((value) =>
    product.sizes.includes(value),
  );

  function handleAdd(thenCheckout = false) {
    if (isSoldOut) return;
    if (!size) {
      setError("Choose a size before adding this piece to your bag.");
      return;
    }
    setError("");
    addItem({ productId: product.id, size, color, quantity });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2600);
    notify({
      title: "Added to bag",
      description: `${product.name} — ${color}, size ${size}`,
      image: product.images[0],
    });

    if (thenCheckout) {
      router.push("/checkout");
    }
  }

  return (
    <div className="space-y-7">
      <div>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <Price
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            size="lg"
            className="font-display"
          />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{product.summary}</p>
      </div>

      <div className="flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em]">
        {isSoldOut ? (
          <span className="text-muted">Sold out</span>
        ) : product.stock === "low-stock" ? (
          <span className="text-lime-ink">
            Low stock — only {product.unitsLeft} left
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-ink">
            <span className="h-1.5 w-1.5 bg-lime-deep" aria-hidden="true" />
            In stock
          </span>
        )}
        {!isSoldOut ? (
          <span className="text-muted-2">· Ships nationwide</span>
        ) : null}
      </div>

      <VariantSelector
        label="Colour"
        swatches
        options={product.colors.map((c) => ({ value: c.name, label: c.name, hex: c.hex }))}
        value={color}
        onChange={setColor}
      />

      <VariantSelector
        label="Size"
        options={product.sizes.map((s) => ({ value: s, label: s }))}
        value={size}
        onChange={(next) => {
          setSize(next);
          setError("");
        }}
        disabledValues={disabledSizes}
        hint={product.fit}
      />

      <QuantitySelector value={quantity} onChange={setQuantity} max={10} />

      {error ? (
        <p role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}

      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => handleAdd(false)}
          disabled={isSoldOut}
          className="btn btn-lime w-full"
        >
          {justAdded ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              Added to bag
            </>
          ) : (
            <>
              <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
              Add to bag
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleAdd(true)}
          disabled={isSoldOut}
          className="btn btn-outline w-full"
        >
          <Zap className="h-3.5 w-3.5" aria-hidden="true" />
          Buy now
        </button>

        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="btn btn-ghost w-full text-muted"
        >
          View bag
        </button>
      </div>

      <dl className="space-y-2 border-t border-line pt-5 text-xs">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Delivery</dt>
          <dd className="text-right text-ink-2">
            {formatBDT(deliveryInfo.insideDhaka)} inside Dhaka ·{" "}
            {formatBDT(deliveryInfo.outsideDhaka)} outside
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Free delivery</dt>
          <dd className="text-right text-ink-2">
            On orders over {formatBDT(deliveryInfo.freeDeliveryThreshold)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Exchange</dt>
          <dd className="text-right text-ink-2">14 days, free size exchange</dd>
        </div>
      </dl>
    </div>
  );
}

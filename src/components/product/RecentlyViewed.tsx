"use client";

import { useEffect, useState } from "react";

import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { products } from "@/lib/data/products";
import { pushRecentlyViewed, readRecentlyViewed } from "@/lib/recently-viewed";
import type { Product } from "@/lib/data/types";

/** Records the product being viewed in localStorage. */
export function RecentlyViewedTracker({ slug }: { slug: string }) {
  useEffect(() => {
    pushRecentlyViewed(slug);
  }, [slug]);
  return null;
}

export function RecentlyViewed({ currentSlug }: { currentSlug: string }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const slugs = readRecentlyViewed().filter((slug) => slug !== currentSlug);
    const matched = slugs
      .map((slug) => products.find((product) => product.slug === slug))
      .filter((product): product is (typeof products)[number] => Boolean(product))
      .slice(0, 4);
    setItems(matched);
  }, [currentSlug]);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="recently-viewed-heading" className="border-t border-line bg-paper">
      <div className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
        <SectionHeading
          id="recently-viewed-heading"
          eyebrow="Your trail"
          title="Recently viewed"
          description="Pieces you have looked at in this session, kept here so you do not have to hunt for them again."
        />
        <div className="mt-9">
          <ProductGrid products={items} columns={4} />
        </div>
      </div>
    </section>
  );
}

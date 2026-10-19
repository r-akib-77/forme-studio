import type { Metadata } from "next";
import { Suspense } from "react";

import { CatalogView } from "@/components/catalog/CatalogView";
import { products } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the FORME STUDIO catalogue by product, category, colour, size or style tag.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  return (
    <Suspense fallback={null}>
      <CatalogView
        products={products}
        title={query ? `Search` : "Search"}
        eyebrow={query ? "Search results" : "Find a piece"}
        description={
          query
            ? `Showing everything that matches “${query}”. Refine with the filters on the left, or clear them to widen the range.`
            : "Type a style, a category or a colour in the search bar to narrow the catalogue down."
        }
        query={query}
      />
    </Suspense>
  );
}

"use client";

import { useSearchParams } from "next/navigation";

import { CatalogView } from "@/components/catalog/CatalogView";
import { products } from "@/lib/data/products";

/**
 * The search route is statically exported, so the query string is read on the
 * client after hydration.
 */
export function SearchResults() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();

  return (
    <CatalogView
      products={products}
      title="Search"
      eyebrow={query ? "Search results" : "Find a piece"}
      description={
        query
          ? `Showing everything that matches “${query}”. Refine with the filters, or clear them to widen the range.`
          : "Type a style, a category or a colour in the search bar to narrow the catalogue down."
      }
      query={query}
    />
  );
}

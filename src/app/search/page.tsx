import type { Metadata } from "next";
import { Suspense } from "react";

import { SearchResults } from "@/components/catalog/SearchResults";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search the FORME STUDIO catalogue by product, category, colour, size or style tag.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResults />
    </Suspense>
  );
}

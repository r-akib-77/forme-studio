import type { Metadata } from "next";

import { CatalogView } from "@/components/catalog/CatalogView";
import { products } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "The full FORME STUDIO catalogue — heavyweight tees, oversized fits, jerseys, shirts, cargo pants and accessories.",
};

export default function ShopPage() {
  return (
    <CatalogView
      products={products}
      title="All Products"
      eyebrow="The full catalogue"
      description="Every piece currently in the studio, with filters for category, size, colour and price. Twenty-five styles, one fit language."
    />
  );
}

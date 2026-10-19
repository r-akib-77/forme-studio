import type { Product } from "@/lib/data/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  columns = 4,
  priorityCount = 0,
  className = "",
}: {
  products: Product[];
  columns?: 3 | 4;
  priorityCount?: number;
  className?: string;
}) {
  const gridClass =
    columns === 3
      ? "grid-cols-2 md:grid-cols-3"
      : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className={`grid gap-x-4 gap-y-9 sm:gap-x-5 sm:gap-y-12 ${gridClass} ${className}`}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}

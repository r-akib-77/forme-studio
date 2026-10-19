import type { Collection, Product } from "./data/types";
import { products } from "./data/products";

/** Resolves a collection definition against the live product dataset. */
export function collectionMatches(product: Product, collection: Collection): boolean {
  const { match } = collection;

  if (match.ids && !match.ids.includes(product.id)) return false;
  if (match.categories && !match.categories.includes(product.category)) return false;
  if (match.tags && !match.tags.some((tag) => product.tags.includes(tag))) return false;
  if (match.featuredOnly && !product.featured) return false;
  if (match.bestsellerOnly && !product.bestseller) return false;
  if (match.newestOnly && !product.isNew) return false;
  if (match.maxPrice !== undefined && product.price > match.maxPrice) return false;

  return true;
}

export function getCollectionProducts(collection: Collection): Product[] {
  return products.filter((product) => collectionMatches(product, collection));
}

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function sortProducts(list: Product[], sort: SortKey): Product[] {
  const copy = [...list];
  switch (sort) {
    case "newest":
      return copy.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "featured":
    default:
      return copy.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        if (a.bestseller !== b.bestseller) return a.bestseller ? -1 : 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
}

export type FilterState = {
  categories: string[];
  sizes: string[];
  colors: string[];
  maxPrice: number;
  query: string;
};

export const emptyFilters: FilterState = {
  categories: [],
  sizes: [],
  colors: [],
  maxPrice: 5000,
  query: "",
};

export type Facet = {
  value: string;
  label: string;
  count: number;
  hex?: string;
};

export function uniqueValues(list: Product[], key: "sizes" | "colors"): Facet[] {
  const map = new Map<string, Facet>();
  for (const product of list) {
    const values = key === "sizes" ? product.sizes : product.colors.map((c) => c.name);
    for (const value of values) {
      const existing = map.get(value);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(value, {
          value,
          label: value,
          count: 1,
          hex: key === "colors" ? product.colors.find((c) => c.name === value)?.hex : undefined,
        });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
}

/** Facets for the category filter, with a friendly label. */
export function categoryFacets(list: Product[]): Facet[] {
  const map = new Map<string, number>();
  for (const product of list) {
    map.set(product.category, (map.get(product.category) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([value, count]) => ({
      value,
      label: value.replace(/-/g, " "),
      count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function priceCeiling(list: Product[]): number {  if (list.length === 0) return 5000;
  const max = Math.max(...list.map((p) => p.price));
  return Math.ceil(max / 500) * 500;
}

/** Applies the active filter state to a product list. */
export function applyFilters(list: Product[], filters: FilterState): Product[] {
  const query = filters.query.trim().toLowerCase();
  return list.filter((product) => {
    if (filters.categories.length && !filters.categories.includes(product.category)) {
      return false;
    }
    if (filters.sizes.length) {
      const hasSize = product.sizes.some((size) => filters.sizes.includes(size));
      if (!hasSize) return false;
    }
    if (filters.colors.length) {
      const hasColor = product.colors.some((color) => filters.colors.includes(color.name));
      if (!hasColor) return false;
    }
    if (product.price > filters.maxPrice) return false;
    if (query && !productMatchesQuery(product, query)) return false;
    return true;
  });
}

export function productMatchesQuery(product: Product, rawQuery: string): boolean {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return true;
  const haystack = [
    product.name,
    product.summary,
    product.description,
    product.category,
    product.material,
    product.fit,
    ...product.tags,
    ...product.colors.map((c) => c.name),
    ...product.sizes,
  ]
    .join(" ")
    .toLowerCase();
  return query
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token));
}

export function activeFilterCount(filters: FilterState): number {
  return (
    filters.categories.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.maxPrice < 5000 ? 1 : 0)
  );
}

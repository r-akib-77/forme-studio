export type CategorySlug =
  | "t-shirts"
  | "oversized"
  | "jerseys"
  | "shirts"
  | "bottoms"
  | "accessories";

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export type ProductColor = {
  name: string;
  /** Hex value used for the swatch chip. */
  hex: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Short line used on cards and in search results. */
  summary: string;
  description: string;
  category: CategorySlug;
  /** Price in Bangladeshi taka. */
  price: number;
  /** Original price in taka, when the item is on offer. */
  compareAtPrice?: number;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  stock: StockStatus;
  /** Remaining units — only meaningful for `low-stock`. */
  unitsLeft?: number;
  tags: string[];
  featured: boolean;
  bestseller: boolean;
  isNew: boolean;
  /** ISO date, used for the "newest" sort. */
  createdAt: string;
  material: string;
  fit: string;
  details: string[];
  care: string[];
};

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
};

export type Collection = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  match: {
    categories?: CategorySlug[];
    tags?: string[];
    ids?: string[];
    featuredOnly?: boolean;
    bestsellerOnly?: boolean;
    newestOnly?: boolean;
    maxPrice?: number;
  };
};

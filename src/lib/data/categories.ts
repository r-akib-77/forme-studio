import type { Category } from "./types";

export const categories: Category[] = [
  {
    slug: "t-shirts",
    name: "T-Shirts",
    description:
      "Heavyweight cotton, clean shoulder lines and a fit that holds its shape wash after wash.",
    image: "/images/categories/cat-t-shirts.jpg",
  },
  {
    slug: "oversized",
    name: "Oversized Tees",
    description:
      "Dropped shoulders, longer bodies and the relaxed volume we build the whole studio around.",
    image: "/images/categories/cat-oversized.jpg",
  },
  {
    slug: "jerseys",
    name: "Jerseys",
    description:
      "Match-day inspired kits with breathable mesh panels and considered number placement.",
    image: "/images/categories/cat-jerseys.jpg",
  },
  {
    slug: "shirts",
    name: "Shirts",
    description:
      "Oxford cotton, brushed twill and relaxed button-downs cut for movement.",
    image: "/images/categories/cat-shirts.jpg",
  },
  {
    slug: "bottoms",
    name: "Bottoms",
    description:
      "Cargo, denim, chinos and sweatpants engineered around how you actually sit and walk.",
    image: "/images/categories/cat-bottoms.jpg",
  },
  {
    slug: "accessories",
    name: "Accessories",
    description:
      "Caps, totes, slings and knitwear — the small pieces that finish the outfit.",
    image: "/images/categories/cat-accessories.jpg",
  },
];

export const categoryMap = new Map(categories.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category | undefined {
  return categoryMap.get(slug as Category["slug"]);
}

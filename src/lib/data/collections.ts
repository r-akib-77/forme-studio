import type { Collection } from "./types";

/**
 * Editorial collections. Each one resolves against the local product dataset,
 * so every collection page is always backed by real catalogue data.
 */
export const collections: Collection[] = [
  {
    slug: "new-arrivals",
    title: "New Arrivals",
    eyebrow: "Just Landed",
    description:
      "The latest pieces to leave the studio. Small runs, released as soon as they are ready.",
    image: "/images/editorial/lookbook.jpg",
    match: { newestOnly: true },
  },
  {
    slug: "t-shirts",
    title: "T-Shirts",
    eyebrow: "Core Range",
    description:
      "The foundation of the studio — heavyweight, mid-weight and washed cotton tees, cut to hold their shape.",
    image: "/images/categories/cat-t-shirts.jpg",
    match: { categories: ["t-shirts"] },
  },
  {
    slug: "oversized",
    title: "Oversized",
    eyebrow: "Relaxed Volume",
    description:
      "Dropped shoulders, extended bodies and heavier knits. Built for layering and for movement.",
    image: "/images/categories/cat-oversized.jpg",
    match: { categories: ["oversized"] },
  },
  {
    slug: "jerseys",
    title: "Jerseys",
    eyebrow: "Match Day",
    description:
      "Match-inspired kits in breathable mesh, with tonal graphics and considered number placement.",
    image: "/images/categories/cat-jerseys.jpg",
    match: { categories: ["jerseys"] },
  },
  {
    slug: "shirts",
    title: "Shirts",
    eyebrow: "Beyond The Tee",
    description:
      "Oxford, twill and chambray button-downs cut for movement and built to be worn open.",
    image: "/images/categories/cat-shirts.jpg",
    match: { categories: ["shirts"] },
  },
  {
    slug: "bottoms",
    title: "Bottoms",
    eyebrow: "Ground Level",
    description:
      "Cargo, denim, sweatpants and chinos engineered around how you actually sit, walk and stand.",
    image: "/images/categories/cat-bottoms.jpg",
    match: { categories: ["bottoms"] },
  },
  {
    slug: "accessories",
    title: "Accessories",
    eyebrow: "Finishing Touches",
    description:
      "Caps, totes, slings and knitwear — the small pieces that complete the whole look.",
    image: "/images/categories/cat-accessories.jpg",
    match: { categories: ["accessories"] },
  },
  {
    slug: "bestsellers",
    title: "Bestsellers",
    eyebrow: "Most Reordered",
    description:
      "The pieces our customers keep coming back for — reordered more than anything else in the studio.",
    image: "/images/editorial/collection.jpg",
    match: { bestsellerOnly: true },
  },
  {
    slug: "studio-edit",
    title: "The Studio Edit",
    eyebrow: "Curated",
    description:
      "A tight edit of the pieces we would build an entire week of outfits around.",
    image: "/images/editorial/brand-story.jpg",
    match: {
      ids: [
        "fms-tee-001",
        "fms-tee-003",
        "fms-ovr-010",
        "fms-jrs-012",
        "fms-shr-015",
        "fms-btm-018",
        "fms-acc-022",
        "fms-acc-023",
      ],
    },
  },
];

export const collectionMap = new Map(collections.map((c) => [c.slug, c]));

export function getCollection(slug: string): Collection | undefined {
  return collectionMap.get(slug);
}

export const navCollections = [
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "T-Shirts", href: "/collections/t-shirts" },
  { label: "Jerseys", href: "/collections/jerseys" },
  { label: "Oversized", href: "/collections/oversized" },
  { label: "Bottoms", href: "/collections/bottoms" },
  { label: "Collections", href: "/collections" },
];

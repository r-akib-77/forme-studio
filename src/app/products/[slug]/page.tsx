import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDown, Truck, Undo2 } from "lucide-react";

import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import {
  RecentlyViewed,
  RecentlyViewedTracker,
} from "@/components/product/RecentlyViewed";
import { Badge } from "@/components/ui/Price";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getProductBySlug, products } from "@/lib/data/products";
import { getCategory } from "@/lib/data/categories";
import { formatDate } from "@/lib/format";
import { site } from "@/lib/data/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return { title: "Product not found" };
  }
  return {
    title: product.name,
    description: product.summary,
    openGraph: {
      title: `${product.name} | ${site.name}`,
      description: product.summary,
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = products
    .filter(
      (candidate) =>
        candidate.slug !== product.slug && candidate.category === product.category,
    )
    .slice(0, 4);

  const fallbackRelated =
    related.length >= 4
      ? related
      : products
          .filter(
            (candidate) =>
              candidate.slug !== product.slug && !related.includes(candidate),
          )
          .slice(0, 4 - related.length);

  return (
    <>
      <RecentlyViewedTracker slug={product.slug} />
      <div className="mx-auto max-w-[1600px] px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-7">
          <ol className="flex flex-wrap items-center gap-2 text-[0.66rem] uppercase tracking-[0.16em] text-muted">
            <li>
              <Link href="/" className="transition-colors hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-muted-2">
              /
            </li>
            {category ? (
              <>
                <li>
                  <Link
                    href={`/collections/${category.slug}`}
                    className="transition-colors hover:text-ink"
                  >
                    {category.name}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-muted-2">
                  /
                </li>
              </>
            ) : null}
            <li className="text-ink">{product.name}</li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              name={product.name}
              badge={
                <>
                  {product.isNew ? <Badge tone="lime">New</Badge> : null}
                  {product.bestseller ? <Badge tone="ink">Bestseller</Badge> : null}
                  {product.compareAtPrice ? (
                    <Badge tone="outline">On offer</Badge>
                  ) : null}
                </>
              }
            />
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <p className="eyebrow mb-3">
                {category?.name ?? "Studio"} · {formatDate(product.createdAt)}
              </p>
              <h1 className="display-md text-ink">{product.name}</h1>

              <div className="mt-7 border-t border-line pt-7">
                <ProductPurchasePanel product={product} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-10 border-t border-line pt-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <h2 className="eyebrow mb-3">The piece</h2>
            <p className="max-w-2xl text-[0.95rem] leading-relaxed text-ink-2">
              {product.description}
            </p>

            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {product.details.map((detail) => (
                <li key={detail} className="flex items-start gap-2.5 text-sm text-muted">
                  <span
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-lime-deep"
                    aria-hidden="true"
                  />
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <h2 className="eyebrow mb-3">Specifications</h2>
            <dl className="divide-y divide-line border-y border-line">
              {[
                { label: "Material", value: product.material },
                { label: "Fit", value: product.fit },
                { label: "Colours", value: product.colors.map((c) => c.name).join(", ") },
                { label: "Sizes", value: product.sizes.join(" · ") },
              ].map((row) => (
                <div key={row.label} className="flex gap-4 py-3">
                  <dt className="w-24 shrink-0 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    {row.label}
                  </dt>
                  <dd className="text-sm text-ink-2">{row.value}</dd>
                </div>
              ))}
            </dl>

            <details className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink">
                Care instructions
                <ChevronDown
                  className="h-4 w-4 text-muted transition-transform duration-300 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <ul className="space-y-1.5 pb-5">
                {product.care.map((line) => (
                  <li key={line} className="text-sm text-muted">
                    {line}
                  </li>
                ))}
              </ul>
            </details>

            <details className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink">
                Delivery &amp; exchange
                <ChevronDown
                  className="h-4 w-4 text-muted transition-transform duration-300 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <div className="space-y-3 pb-5 text-sm text-muted">
                <p className="flex items-start gap-2.5">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-lime-ink" strokeWidth={1.7} aria-hidden="true" />
                  Delivery to every district, with cash on delivery available. Free delivery
                  on orders over ৳2,000.
                </p>
                <p className="flex items-start gap-2.5">
                  <Undo2 className="mt-0.5 h-4 w-4 shrink-0 text-lime-ink" strokeWidth={1.7} aria-hidden="true" />
                  14-day exchange window for a free size swap, in store or against a new
                  order.
                </p>
                <p className="text-xs text-muted-2">
                  These details are demo policy content and can be edited in the site
                  configuration.
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {fallbackRelated.length > 0 ? (
        <section aria-labelledby="related-heading" className="border-t border-line bg-bone">
          <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
            <SectionHeading
              id="related-heading"
              eyebrow="Goes with"
              title="You may also like"
              description="Pieces from the same part of the range, chosen to work with this one."
            />
            <div className="mt-9">
              <ProductGrid products={[...related, ...fallbackRelated]} columns={4} />
            </div>
          </div>
        </section>
      ) : null}

      <RecentlyViewed currentSlug={product.slug} />
    </>
  );
}

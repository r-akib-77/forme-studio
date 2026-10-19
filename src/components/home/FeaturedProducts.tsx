import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductGrid } from "@/components/product/ProductGrid";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { products } from "@/lib/data/products";

export function FeaturedProducts() {
  const featured = products.filter((product) => product.featured).slice(0, 8);

  return (
    <section aria-labelledby="rotation-heading" className="bg-bone">
      <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="The Current Rotation"
            title="The pieces you will keep reaching for"
            description="Eight styles from the studio right now — the ones that leave the shelf fastest."
            action={
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink"
              >
                <span className="link-underline">View all products</span>
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            }
          />
        </Reveal>

        <div className="mt-10 sm:mt-12">
          <ProductGrid products={featured} columns={4} />
        </div>
      </div>
    </section>
  );
}

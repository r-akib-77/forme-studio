import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { products } from "@/lib/data/products";

export function Bestsellers() {
  const bestsellers = products.filter((product) => product.bestseller).slice(0, 8);

  return (
    <section aria-labelledby="bestsellers-heading" className="border-t border-line bg-paper">
      <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Most reordered"
            title="Bestsellers"
            description="The styles our customers come back for — reordered more than anything else in the studio."
            action={
              <Link
                href="/collections/bestsellers"
                className="group inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink"
              >
                <span className="link-underline">Shop bestsellers</span>
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            }
          />
        </Reveal>

        <div className="mt-10 sm:mt-12">
          {/* Horizontal rail on small screens, grid from tablet up. */}
          <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {bestsellers.map((product) => (
              <li
                key={product.id}
                className="w-[68vw] max-w-[17rem] shrink-0 snap-start sm:w-auto sm:max-w-none"
              >
                <div className="relative">
                  <span className="mb-3 inline-flex items-center gap-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-lime-ink">
                    <Flame className="h-3 w-3" strokeWidth={1.8} aria-hidden="true" />
                    Bestseller
                  </span>
                  <ProductCard product={product} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

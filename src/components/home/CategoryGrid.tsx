import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { categories } from "@/lib/data/categories";
import { getCollectionProducts } from "@/lib/filters";
import { getCollection } from "@/lib/data/collections";

export function CategoryGrid() {
  return (
    <section aria-labelledby="categories-heading" className="bg-paper">
      <div className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-3">Shop by category</p>
              <h2 id="categories-heading" className="display-md text-ink">
                Find your shape
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              Six categories, one point of view. Every piece is designed to work with
              everything else in the studio.
            </p>
          </div>
        </Reveal>

        <ul className="mt-8 grid grid-cols-2 gap-2.5 sm:mt-10 sm:gap-4 lg:grid-cols-3">
          {categories.map((category, index) => {
            const collection = getCollection(category.slug);
            const count = collection ? getCollectionProducts(collection).length : 0;
            return (
              <Reveal
                as="li"
                key={category.slug}
                delay={Math.min(index * 0.05, 0.3)}
              >
                <Link
                  href={`/collections/${category.slug}`}
                  className="group relative block overflow-hidden bg-sand"
                >
                  <div className="media-frame relative aspect-[3/4] w-full sm:aspect-[4/5]">
                    <Image
                      src={category.image}
                      alt={`${category.name} — FORME STUDIO collection`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-5">
                    <div className="min-w-0 pr-8 sm:pr-10">
                      <h3 className="font-display text-lg font-semibold leading-tight tracking-tight text-paper sm:text-2xl">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-paper/70">
                        {count} {count === 1 ? "piece" : "pieces"}
                      </p>
                    </div>
                    <span className="absolute bottom-3 right-3 flex h-8 w-8 shrink-0 items-center justify-center border border-paper/45 text-paper transition-colors duration-300 group-hover:border-lime group-hover:bg-lime group-hover:text-ink sm:bottom-5 sm:right-5 sm:h-9 sm:w-9">
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

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
      <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
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

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {categories.map((category, index) => {
            const collection = getCollection(category.slug);
            const count = collection ? getCollectionProducts(collection).length : 0;
            return (
              <Reveal
                as="li"
                key={category.slug}
                delay={Math.min(index * 0.06, 0.3)}
                className={index === 0 ? "col-span-2 lg:col-span-1" : ""}
              >
                <Link
                  href={`/collections/${category.slug}`}
                  className="group relative block overflow-hidden bg-sand"
                >
                  <div
                    className={`media-frame relative w-full ${
                      index === 0 ? "aspect-[16/10] lg:aspect-[4/5]" : "aspect-[4/5]"
                    }`}
                  >
                    <Image
                      src={category.image}
                      alt={`${category.name} — FORME STUDIO collection`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                    <div>
                      <h3 className="font-display text-xl font-semibold tracking-tight text-paper sm:text-2xl">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-paper/65">
                        {count} {count === 1 ? "piece" : "pieces"}
                      </p>
                    </div>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-paper/40 text-paper transition-colors duration-300 group-hover:border-lime group-hover:bg-lime group-hover:text-ink">
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

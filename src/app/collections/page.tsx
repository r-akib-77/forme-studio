import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { collections } from "@/lib/data/collections";
import { getCollectionProducts } from "@/lib/filters";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Browse every FORME STUDIO collection — new arrivals, core tees, oversized fits, jerseys, shirts, bottoms and accessories.",
};

export default function CollectionsIndexPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:px-10">
      <header className="max-w-2xl">
        <p className="eyebrow mb-3">The range</p>
        <h1 className="display-lg text-ink">Collections</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
          {site.description} Every collection below is filtered from the same studio
          catalogue, so nothing you see here is a dead end.
        </p>
      </header>

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection, index) => {
          const count = getCollectionProducts(collection).length;
          return (
            <Reveal as="li" key={collection.slug} delay={Math.min(index * 0.05, 0.3)}>
              <Link
                href={`/collections/${collection.slug}`}
                className="group flex h-full flex-col border border-line bg-paper transition-colors duration-300 hover:border-ink"
              >
                <div className="media-frame relative aspect-[4/3] w-full">
                  <Image
                    src={collection.image}
                    alt={`${collection.title} collection`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="eyebrow">{collection.eyebrow}</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                    {collection.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {collection.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink">
                    <span className="link-underline">
                      {count} {count === 1 ? "piece" : "pieces"}
                    </span>
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}

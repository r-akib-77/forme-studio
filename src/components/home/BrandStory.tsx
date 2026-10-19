import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";

const pillars = [
  {
    title: "Fit first",
    body: "We start from the body, not the trend. Every fit in the studio is drawn on the same block, so a tee and a shirt sit together properly.",
  },
  {
    title: "Built for real days",
    body: "Rickshaws, AC offices, humid afternoons and long walks. Fabrics are chosen to handle all four without looking like workwear.",
  },
  {
    title: "Considered, not cluttered",
    body: "Small runs, a tight palette and no seasonal churn. We would rather restock a good piece than replace it.",
  },
];

export function BrandStory() {
  return (
    <section aria-labelledby="story-heading" className="border-t border-line bg-bone">
      <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <div className="media-frame relative aspect-[5/4] w-full">
              <Image
                src="/images/editorial/brand-story.jpg"
                alt="A rail of FORME STUDIO garments hanging in the studio"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="order-1 lg:order-2">
            <p className="eyebrow mb-4">The studio</p>
            <h2 id="story-heading" className="display-md text-ink">
              We design the rotation, not the season.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
              FORME STUDIO started with one idea: most wardrobes do not need more options,
              they need better ones. So we build a small, deliberate range — heavyweight
              tees, oversized fits, match-inspired jerseys and everyday layers — and make
              sure every piece works with the last one.
            </p>

            <dl className="mt-9 space-y-7 border-t border-line pt-8">
              {pillars.map((pillar) => (
                <div key={pillar.title}>
                  <dt className="font-display text-lg font-semibold tracking-tight text-ink">
                    {pillar.title}
                  </dt>
                  <dd className="mt-1.5 max-w-md text-sm leading-relaxed text-muted">
                    {pillar.body}
                  </dd>
                </div>
              ))}
            </dl>

            <Link href="/collections/studio-edit" className="btn btn-outline group mt-9">
              Read the full edit
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>

            <p className="mt-6 max-w-md text-xs leading-relaxed text-muted-2">
              FORME STUDIO is a fictional brand created to demonstrate this storefront
              design. No real company history is claimed.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

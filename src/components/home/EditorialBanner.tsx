import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";

export function EditorialBanner() {
  return (
    <section aria-labelledby="campaign-heading" className="bg-paper">
      <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow mb-4 flex items-center gap-2.5">
              <span className="h-px w-8 bg-lime-deep" aria-hidden="true" />
              The Everyday Edit
            </p>
            <h2 id="campaign-heading" className="display-lg text-ink">
              Less noise.
              <br />
              Better fit.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted sm:text-base">
              Thoughtfully selected essentials for your everyday rotation. No seasonal
              churn, no dead stock — just the pieces that earn their place in your
              wardrobe.
            </p>

            <ul className="mt-8 space-y-3 border-t border-line pt-6">
              {[
                "Fabric weight chosen for the climate",
                "Small runs, restocked when they sell out",
                "One fit language across every category",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-ink-2">
                  <span
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-lime"
                    aria-hidden="true"
                  />
                  {point}
                </li>
              ))}
            </ul>

            <Link
              href="/collections/studio-edit"
              className="btn btn-ink group mt-9"
            >
              Discover the collection
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-7">
            <div className="relative">
              <div className="media-frame relative aspect-[4/5] w-full sm:aspect-[16/11] lg:aspect-[4/5]">
                <Image
                  src="/images/editorial/campaign.jpg"
                  alt="Model in a crisp white shirt seated on a stool against a deep red backdrop, from the FORME STUDIO campaign"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
              </div>
              {/* Caption sits inside the frame on phones, overlapping the edge on
                  larger screens where there is room for it. */}
              <div className="absolute bottom-0 left-0 right-0 bg-ink px-4 py-3.5 text-paper sm:-bottom-6 sm:left-6 sm:right-auto sm:px-6 sm:py-5">
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-lime">
                  Campaign 01
                </p>
                <p className="mt-1.5 max-w-[14rem] text-sm leading-snug text-paper/85">
                  The Everyday Edit — shot across Dhaka, one frame at a time.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

import { Layers, RefreshCw, ShieldCheck, Truck } from "lucide-react";

import { trustPoints } from "@/lib/data/site";

const iconMap = {
  layers: Layers,
  refresh: RefreshCw,
  shield: ShieldCheck,
  truck: Truck,
} as const;

export function TrustStrip() {
  return (
    <section aria-label="Why shop with FORME STUDIO" className="border-b border-line bg-paper">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <ul className="grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
          {trustPoints.map((point) => {
            const Icon = iconMap[point.icon];
            return (
              <li
                key={point.title}
                className="flex flex-col gap-2 border-b border-line py-7 pr-4 last:border-b-0 lg:border-b-0 lg:px-7 lg:first:pl-0 lg:last:pr-0"
              >
                <Icon
                  className="h-4.5 w-4.5 text-lime-ink"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink">
                  {point.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted">{point.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

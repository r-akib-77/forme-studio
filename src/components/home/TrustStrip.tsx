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
        {/* One column on phones, two on tablets, four on desktop — every cell
            keeps its icon and title on a single row so nothing drifts. */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((point, index) => {
            const Icon = iconMap[point.icon];
            const last = index === trustPoints.length - 1;
            return (
              <li
                key={point.title}
                className={`flex gap-3.5 py-5 sm:gap-3 sm:py-6 lg:px-7 lg:first:pl-0 lg:last:pr-0 ${
                  last ? "" : "border-b border-line"
                } ${index % 2 === 0 ? "sm:border-r sm:border-line sm:pr-5 lg:border-r-0" : "sm:pl-5"} ${
                  index < 2 ? "sm:border-b sm:border-line lg:border-b-0" : ""
                }`}
              >
                <Icon
                  className="mt-0.5 h-4 w-4 shrink-0 text-lime-ink"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink">
                    {point.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">{point.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({
  images,
  name,
  badge,
}: {
  images: string[];
  name: string;
  badge?: React.ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row lg:gap-5">
      <ul className="no-scrollbar flex gap-3 overflow-x-auto lg:w-20 lg:flex-col lg:overflow-visible">
        {images.map((image, index) => (
          <li key={image} className="shrink-0">
            <button
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1} of ${name}`}
              aria-current={active === index}
              className={`media-frame relative block h-24 w-[74px] border transition-colors lg:h-[92px] lg:w-[74px] ${
                active === index ? "border-ink" : "border-line hover:border-line-strong"
              }`}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="74px"
                className="object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="relative flex-1">
        <button
          type="button"
          onClick={() => setZoom(true)}
          aria-label={`Enlarge ${name} image`}
          className="media-frame relative block aspect-[4/5] w-full cursor-zoom-in"
        >
          <Image
            src={images[active]}
            alt={`${name} — view ${active + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
        </button>

        {badge ? (
          <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {badge}
          </div>
        ) : null}

        {zoom ? (
          <div
            className="fixed inset-0 z-[85] flex items-center justify-center bg-ink/95 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`${name} enlarged image`}
            onClick={() => setZoom(false)}
          >
            <button
              type="button"
              onClick={() => setZoom(false)}
              className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center border border-paper/30 text-paper transition-colors hover:border-paper"
              aria-label="Close enlarged image"
            >
              <span aria-hidden="true" className="text-lg leading-none">
                ✕
              </span>
            </button>
            <div className="relative h-full max-h-[86vh] w-full max-w-3xl">
              <Image
                src={images[active]}
                alt={`${name} — enlarged view`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

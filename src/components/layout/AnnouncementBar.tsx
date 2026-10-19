"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

import { announcements } from "@/lib/data/site";

export function AnnouncementBar() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || announcements.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % announcements.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <div className="relative z-50 border-b border-ink/10 bg-ink text-paper">
      <div className="mx-auto flex h-9 max-w-[1600px] items-center justify-center gap-3 px-4 sm:px-6">
        <span className="hidden h-1.5 w-1.5 shrink-0 bg-lime sm:block" aria-hidden="true" />
        <p
          key={index}
          aria-live="polite"
          className="truncate text-center text-[0.6rem] font-semibold uppercase tracking-[0.24em] transition-opacity duration-500 sm:text-[0.66rem]"
        >
          {announcements[index]}
        </p>
        <span className="hidden h-1.5 w-1.5 shrink-0 bg-lime sm:block" aria-hidden="true" />
        <span className="hidden text-[0.6rem] font-medium uppercase tracking-[0.24em] text-paper/55 lg:inline">
          {announcements[(index + 1) % announcements.length]}
        </span>
      </div>
    </div>
  );
}

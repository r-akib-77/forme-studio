"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  const fade = (delay: number) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 26 },
    animate: reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
    transition: { duration: 0.75, delay, ease },
  });

  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="relative">
        <div className="relative aspect-[4/5] w-full sm:aspect-[16/11] lg:aspect-[21/9]">
          <Image
            src="/images/editorial/hero.jpg"
            alt="Model in an oversized tee standing in smoke on a city street, wearing the FORME STUDIO everyday collection"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[62%_center] sm:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-ink/5 sm:from-ink/80 sm:via-ink/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/20" />
        </div>

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[1600px] px-4 pb-10 sm:px-6 sm:pb-14 lg:px-10 lg:pb-20">
            <div className="max-w-3xl">
              <motion.p
                {...fade(0.05)}
                className="flex items-center gap-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-lime"
              >
                <span className="h-px w-8 bg-lime" aria-hidden="true" />
                The New Everyday
              </motion.p>

              <motion.h1
                {...fade(0.14)}
                className="display-xl mt-5 text-paper"
              >
                Wear your
                <br />
                own energy.
              </motion.h1>

              <motion.p
                {...fade(0.24)}
                className="mt-5 max-w-md text-sm leading-relaxed text-paper/75 sm:text-base"
              >
                Everyday essentials. Elevated fits. Made for the way you move.
              </motion.p>

              <motion.div
                {...fade(0.34)}
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <Link
                  href="/collections/new-arrivals"
                  className="btn btn-lime group w-full sm:w-auto"
                >
                  Shop new arrivals
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href="/collections"
                  className="btn w-full border border-paper/35 bg-transparent text-paper hover:border-paper hover:bg-paper/10 sm:w-auto"
                >
                  Explore collections
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

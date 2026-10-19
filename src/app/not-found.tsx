import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

import { Wordmark } from "@/components/ui/Wordmark";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <span className="flex h-14 w-14 items-center justify-center bg-ink text-paper">
        <Compass className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <p className="eyebrow mt-7">Error 404</p>
      <h1 className="display-lg mt-3 text-ink">This page left the studio.</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        The link may be outdated, or the piece you are looking for is no longer in the
        catalogue. Try the current rotation instead.
      </p>

      <div className="mt-9 flex flex-col gap-2.5 sm:flex-row">
        <Link href="/collections/new-arrivals" className="btn btn-lime">
          Shop new arrivals
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
        <Link href="/shop" className="btn btn-outline">
          Browse all products
        </Link>
      </div>

      <div className="mt-14">
        <Wordmark />
      </div>
    </div>
  );
}

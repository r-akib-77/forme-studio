import type { Metadata } from "next";

import { BrandMark } from "@/components/ui/Wordmark";

export const metadata: Metadata = {
  title: "FORME STUDIO",
  description: "Contemporary, confident, accessible premium fashion.",
};

export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <BrandMark className="h-6 w-6 animate-pulse text-ink" />
        <p className="eyebrow">Loading</p>
      </div>
    </div>
  );
}

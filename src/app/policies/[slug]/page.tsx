import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getPolicy, policies } from "@/lib/data/policies";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return policies.map((policy) => ({ slug: policy.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) return { title: "Page not found" };
  return { title: policy.title, description: policy.intro };
}

export default async function PolicyPage({ params }: PageProps) {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
      <Link
        href="/"
        className="group mb-7 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1"
          aria-hidden="true"
        />
        Back to home
      </Link>

      <p className="eyebrow mb-3">{policy.eyebrow}</p>
      <h1 className="display-lg text-ink">{policy.title}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        {policy.intro}
      </p>

      <div className="mt-12 space-y-10">
        {policy.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
              {section.heading}
            </h2>
            <ul className="mt-3 space-y-2">
              {section.body.map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
                  <span
                    className="mt-[8px] h-1.5 w-1.5 shrink-0 bg-lime-deep"
                    aria-hidden="true"
                  />
                  {line}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-14 border-t border-line pt-6 text-xs leading-relaxed text-muted-2">
        FORME STUDIO is a fictional brand created for this demonstration. The content on
        this page is placeholder policy text and does not describe a real business.
      </p>
    </div>
  );
}

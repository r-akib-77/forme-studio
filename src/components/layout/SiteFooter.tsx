import Link from "next/link";
import { Facebook, Instagram, Music2, Youtube } from "lucide-react";

import { BrandMark } from "@/components/ui/Wordmark";
import { navCollections } from "@/lib/data/collections";
import { site, socialLinks } from "@/lib/data/site";

const iconMap = {
  Instagram: Instagram,
  Facebook: Facebook,
  TikTok: Music2,
  YouTube: Youtube,
} as const;

const supportLinks = [
  { label: "Delivery Information", href: "/policies/delivery" },
  { label: "Exchange & Returns", href: "/policies/exchange-and-returns" },
  { label: "Size Guide", href: "/policies/size-guide" },
  { label: "Contact Us", href: "/policies/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/policies/privacy-policy" },
  { label: "Terms & Conditions", href: "/policies/terms-and-conditions" },
  { label: "All Products", href: "/shop" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-bone">
      <div className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:gap-x-8 lg:grid-cols-12 lg:gap-8">
          <div className="col-span-2 lg:col-span-4">
            <div className="flex items-center gap-2.5 text-ink">
              <BrandMark className="h-5 w-5" />
              <span className="flex items-baseline gap-2 leading-none">
                <span className="font-display text-lg font-semibold tracking-[-0.01em]">FORME</span>
                <span className="h-3 w-px bg-line-strong" aria-hidden="true" />
                <span className="text-[0.58rem] font-semibold tracking-[0.34em] text-muted">
                  STUDIO
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              {site.description}
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-ink">
              {site.location}
            </p>
            <p className="mt-3 max-w-sm border-l-2 border-lime pl-3 text-xs leading-relaxed text-muted">
              Demo storefront. Products, prices, reviews and contact details shown here are
              sample content for demonstration purposes.
            </p>
          </div>

          <div className="lg:col-span-2">
            <h2 className="eyebrow mb-4">Shop</h2>
            <ul className="space-y-2.5">
              {navCollections.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-2 transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="eyebrow mb-4">Help &amp; Support</h2>
            <ul className="space-y-2.5">
              {supportLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-2 transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="eyebrow mb-4">Legal</h2>
            <ul className="space-y-2.5">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-2 transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="eyebrow mb-4">Follow</h2>
            <ul className="space-y-2.5">
              {socialLinks.map((social) => {
                const Icon = iconMap[social.label as keyof typeof iconMap];
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-sm text-ink-2 transition-colors hover:text-ink"
                    >
                      <Icon
                        className="h-3.5 w-3.5 text-muted transition-colors group-hover:text-ink"
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                      {social.label}
                    </a>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-muted-2">
              Social links open placeholder destinations. FORME STUDIO is a fictional brand
              created for this demonstration.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-10">
          <p className="text-[0.68rem] uppercase tracking-[0.16em] text-muted">
            © {new Date().getFullYear()} {site.name} — Demo storefront
          </p>
          <p className="text-[0.68rem] uppercase tracking-[0.16em] text-muted-2">
            Frontend demonstration — no live payments or orders
          </p>
        </div>
      </div>
    </footer>
  );
}

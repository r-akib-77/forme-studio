import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import "./globals.css";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Providers } from "@/components/providers/Providers";
import { SearchDialog } from "@/components/layout/SearchDialog";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { site } from "@/lib/data/site";

const clash = localFont({
  src: [
    { path: "../fonts/clash-display-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/clash-display-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/clash-display-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/clash-display-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-clash",
  display: "swap",
  fallback: ["Arial Black", "Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: false,
});

const inter = localFont({
  src: "../fonts/inter-variable.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Everyday Essentials, Elevated`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "FORME STUDIO",
    "Bangladesh fashion",
    "heavyweight t-shirt",
    "oversized tee",
    "football jersey",
    "cargo pants",
    "streetwear Dhaka",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — Everyday Essentials, Elevated`,
    description: site.description,
    images: [{ url: "/images/editorial/hero.jpg", width: 1280, height: 853 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Everyday Essentials, Elevated`,
    description: site.description,
    images: ["/images/editorial/hero.jpg"],
  },
  robots: { index: false, follow: false },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${clash.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-paper text-ink antialiased">
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:uppercase focus:tracking-[0.18em] focus:text-paper"
          >
            Skip to content
          </a>
          <AnnouncementBar />
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <MobileNavigation />
          <SearchDialog />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}

import type { NextConfig } from "next";

/**
 * Cloudflare Pages sets `CF_PAGES=1` inside its build environment, so the
 * same `npm run build` script produces a static export there while keeping
 * the full server build (with the image optimiser) for local development.
 *
 * `NEXT_OUTPUT=export` forces the static build anywhere — see
 * `npm run build:static`.
 */
const isStaticExport =
  process.env.CF_PAGES === "1" || process.env.NEXT_OUTPUT === "export";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isStaticExport ? { output: "export" as const } : {}),
  images: {
    // The static export ships the original files from `public/images`.
    ...(isStaticExport ? { unoptimized: true } : {}),
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920],
  },
  trailingSlash: true,
};

export default nextConfig;

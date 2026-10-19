/** Formatting helpers — all prices are handled in Bangladeshi taka. */

const takaFormatter = new Intl.NumberFormat("en-BD", {
  maximumFractionDigits: 0,
});

export function formatBDT(amount: number): string {
  return `৳${takaFormatter.format(amount)}`;
}

export function formatNumber(amount: number): string {
  return takaFormatter.format(amount);
}

export function discountPercent(price: number, compareAtPrice?: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

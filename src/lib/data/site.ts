/**
 * Site-wide configuration. Everything a store owner might want to change
 * lives here rather than being hard-coded into components.
 */

export const site = {
  name: "FORME STUDIO",
  shortName: "FORME",
  tagline: "Contemporary, confident, accessible premium fashion.",
  description:
    "FORME STUDIO makes considered everyday essentials — heavyweight tees, oversized fits, match-inspired jerseys and everyday layers for modern Bangladeshi shoppers.",
  url: "https://forme-studio.example.com",
  currency: "৳",
  locale: "en-BD",
  location: "Dhaka, Bangladesh",
} as const;

export const announcements = [
  "FREE DELIVERY ON ORDERS OVER ৳2,000",
  "NEW SEASON — THE EVERYDAY EDIT IS LIVE",
] as const;

export const trustPoints = [
  {
    icon: "layers",
    title: "Quality-First Materials",
    body: "We design around fabric weight and construction, not trend cycles.",
  },
  {
    icon: "refresh",
    title: "Easy Exchange",
    body: "Wrong size? Exchange it in store or against a new order.",
  },
  {
    icon: "shield",
    title: "Secure Checkout",
    body: "Checkout is handled locally in this demo — no card data is collected.",
  },
  {
    icon: "truck",
    title: "Nationwide Delivery",
    body: "We ship to every district, with cash on delivery available.",
  },
] as const;

export const deliveryInfo = {
  /** Delivery fee inside Dhaka city, in taka. */
  insideDhaka: 60,
  /** Delivery fee outside Dhaka city, in taka. */
  outsideDhaka: 120,
  /** Orders at or above this value ship free, in taka. */
  freeDeliveryThreshold: 2000,
  note: "Delivery charges are demo configuration and can be edited in site config.",
};

export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "Facebook", href: "https://www.facebook.com/" },
  { label: "TikTok", href: "https://www.tiktok.com/" },
  { label: "YouTube", href: "https://www.youtube.com/" },
] as const;

export const districts = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Khulna",
  "Rajshahi",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Cumilla",
  "Narayanganj",
  "Gazipur",
  "Bogura",
  "Jashore",
  "Cox's Bazar",
] as const;

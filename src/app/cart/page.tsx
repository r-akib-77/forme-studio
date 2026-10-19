import type { Metadata } from "next";

import { CartPageContent } from "@/components/cart/CartPageContent";

export const metadata: Metadata = {
  title: "Shopping Bag",
  description: "Review the pieces in your FORME STUDIO bag before checkout.",
};

export default function CartPage() {
  return <CartPageContent />;
}

import type { Metadata } from "next";

import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your FORME STUDIO order. This is a frontend demonstration — no payment is processed and no order is created.",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}

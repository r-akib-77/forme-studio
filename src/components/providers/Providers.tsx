"use client";

import type { ReactNode } from "react";

import { CartProvider } from "./CartProvider";
import { OverlayProvider } from "./OverlayProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <OverlayProvider>{children}</OverlayProvider>
    </CartProvider>
  );
}

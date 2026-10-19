"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { getProductById } from "@/lib/data/products";
import { deliveryInfo } from "@/lib/data/site";

export type CartLine = {
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
};

type CartAction =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; line: CartLine }
  | { type: "remove"; lineId: string }
  | { type: "setQuantity"; lineId: string; quantity: number }
  | { type: "clear" };

const STORAGE_KEY = "forme-studio.cart.v1";
const MAX_QUANTITY = 10;

function lineIdFor(productId: string, size: string, color: string) {
  return `${productId}::${size}::${color}`;
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines };

    case "add": {
      const existing = state.lines.find((l) => l.lineId === action.line.lineId);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.lineId === action.line.lineId
              ? { ...l, quantity: Math.min(MAX_QUANTITY, l.quantity + action.line.quantity) }
              : l,
          ),
        };
      }
      return { lines: [...state.lines, action.line] };
    }

    case "remove":
      return { lines: state.lines.filter((l) => l.lineId !== action.lineId) };

    case "setQuantity": {
      const quantity = Math.max(0, Math.min(MAX_QUANTITY, action.quantity));
      if (quantity === 0) {
        return { lines: state.lines.filter((l) => l.lineId !== action.lineId) };
      }
      return {
        lines: state.lines.map((l) =>
          l.lineId === action.lineId ? { ...l, quantity } : l,
        ),
      };
    }

    case "clear":
      return { lines: [] };

    default:
      return state;
  }
}

export type CartTotals = {
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  freeDeliveryRemaining: number;
  qualifiesForFreeDelivery: boolean;
};

type CartContextValue = {
  lines: CartLine[];
  hydrated: boolean;
  totals: CartTotals;
  addItem: (input: {
    productId: string;
    size: string;
    color: string;
    quantity?: number;
  }) => void;
  removeItem: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  isEmpty: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

function isValidLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as Record<string, unknown>;
  return (
    typeof line.lineId === "string" &&
    typeof line.productId === "string" &&
    typeof line.slug === "string" &&
    typeof line.name === "string" &&
    typeof line.price === "number" &&
    typeof line.image === "string" &&
    typeof line.size === "string" &&
    typeof line.color === "string" &&
    typeof line.quantity === "number"
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });
  const [hydrated, setHydrated] = useState(false);
  const initialised = useRef(false);

  // Restore the persisted cart once, on the client.
  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const lines = parsed
            .filter(isValidLine)
            .map((line) => {
              const product = getProductById(line.productId);
              if (!product) return null;
              return {
                ...line,
                price: product.price,
                name: product.name,
                image: product.images[0],
                slug: product.slug,
                quantity: Math.max(1, Math.min(MAX_QUANTITY, line.quantity)),
              };
            })
            .filter((line): line is CartLine => line !== null);
          dispatch({ type: "hydrate", lines });
        }
      }
    } catch {
      // A malformed cart should never break the storefront.
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist on change.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // Storage can be unavailable (private mode); the cart still works in-memory.
    }
  }, [state.lines, hydrated]);

  const addItem = useCallback<CartContextValue["addItem"]>((input) => {
    const product = getProductById(input.productId);
    if (!product) return;
    const size = input.size;
    const color = input.color;
    if (!size || !color) return;

    dispatch({
      type: "add",
      line: {
        lineId: lineIdFor(product.id, size, color),
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size,
        color,
        quantity: Math.max(1, Math.min(MAX_QUANTITY, input.quantity ?? 1)),
      },
    });
  }, []);

  const removeItem = useCallback((lineId: string) => {
    dispatch({ type: "remove", lineId });
  }, []);

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    dispatch({ type: "setQuantity", lineId, quantity });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "clear" });
  }, []);

  const totals = useMemo<CartTotals>(() => {
    const itemCount = state.lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = state.lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
    const qualifies = subtotal >= deliveryInfo.freeDeliveryThreshold;
    const deliveryFee = subtotal === 0 || qualifies ? 0 : deliveryInfo.insideDhaka;
    return {
      itemCount,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      freeDeliveryRemaining: Math.max(0, deliveryInfo.freeDeliveryThreshold - subtotal),
      qualifiesForFreeDelivery: qualifies && subtotal > 0,
    };
  }, [state.lines]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines: state.lines,
      hydrated,
      totals,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      isEmpty: state.lines.length === 0,
    }),
    [state.lines, hydrated, totals, addItem, removeItem, setQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return context;
}

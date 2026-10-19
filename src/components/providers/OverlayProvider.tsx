"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, X } from "lucide-react";

type Toast = {
  id: number;
  title: string;
  description?: string;
  image?: string;
};

type OverlayContextValue = {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  notify: (toast: Omit<Toast, "id">) => void;
};

const OverlayContext = createContext<OverlayContextValue | null>(null);

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);
  const reduceMotion = useReducedMotion();

  const notify = useCallback((toast: Omit<Toast, "id">) => {
    counter.current += 1;
    const id = counter.current;
    setToasts((current) => [...current.slice(-2), { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  // Lock background scrolling while an overlay is open, and clear any toast so
  // it can never sit on top of a drawer's call to action.
  const anyOpen = cartOpen || searchOpen || mobileNavOpen;
  useEffect(() => {
    if (!anyOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setToasts([]);
    return () => {
      document.body.style.overflow = previous;
    };
  }, [anyOpen]);

  const value = useMemo<OverlayContextValue>(
    () => ({
      cartOpen,
      setCartOpen,
      searchOpen,
      setSearchOpen,
      mobileNavOpen,
      setMobileNavOpen,
      notify,
    }),
    [cartOpen, searchOpen, mobileNavOpen, notify],
  );

  return (
    <OverlayContext.Provider value={value}>
      {children}
      <ToastStack toasts={toasts} reduceMotion={!!reduceMotion} />
    </OverlayContext.Provider>
  );
}

export function useOverlay(): OverlayContextValue {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error("useOverlay must be used inside <OverlayProvider>");
  }
  return context;
}

function ToastStack({
  toasts,
  reduceMotion,
}: {
  toasts: Toast[];
  reduceMotion: boolean;
}) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[95] flex flex-col items-center gap-2 px-4 pb-4 pt-6 sm:items-end sm:px-6 sm:pb-6"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 border border-ink bg-ink px-4 py-3 text-paper shadow-[0_18px_40px_-20px_rgba(0,0,0,0.65)]"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-lime text-ink">
              <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.78rem] font-semibold tracking-wide uppercase">
                {toast.title}
              </p>
              {toast.description ? (
                <p className="truncate text-xs text-paper/70">{toast.description}</p>
              ) : null}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function CloseButton({
  onClick,
  label = "Close",
  className = "",
}: {
  onClick: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`inline-flex h-10 w-10 items-center justify-center border border-line bg-paper text-ink transition-colors hover:border-ink ${className}`}
    >
      <X className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

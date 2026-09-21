"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { GrindOption, Size } from "./products";
import { getProductBySlug, priceForSize } from "./products";

export interface CartLine {
  id: string;
  slug: string;
  name: string;
  roast: string;
  size: Size;
  grind: GrindOption;
  quantity: number;
  unitPrice: number;
}

interface CartState {
  lines: CartLine[];
  wishlist: string[];
}

const CART_KEY = "coffee-with-thabi:cart";
const WISHLIST_KEY = "coffee-with-thabi:wishlist";

interface CartContextValue {
  lines: CartLine[];
  wishlist: string[];
  itemCount: number;
  subtotal: number;
  isMiniCartOpen: boolean;
  openMiniCart: () => void;
  closeMiniCart: () => void;
  addToCart: (args: {
    slug: string;
    name: string;
    roast: string;
    size: Size;
    grind: GrindOption;
    basePrice: number;
    quantity?: number;
  }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeLine: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

function lineId(slug: string, size: Size, grind: GrindOption) {
  return `${slug}__${size}__${grind}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>({ lines: [], wishlist: [] });
  const [isMiniCartOpen, setMiniCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const rawCart = window.localStorage.getItem(CART_KEY);
      const rawWishlist = window.localStorage.getItem(WISHLIST_KEY);
      const storedLines: CartLine[] = rawCart ? JSON.parse(rawCart) : [];
      setState({
        lines: storedLines
          .filter((l) => getProductBySlug(l.slug))
          .map((l) => ({
            ...l,
            unitPrice: priceForSize(getProductBySlug(l.slug)!.price, l.size),
          })),
        wishlist: rawWishlist ? JSON.parse(rawWishlist) : [],
      });
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(state.lines));
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(state.wishlist));
    } catch {
      // ignore quota errors
    }
  }, [state, hydrated]);

  const addToCart = useCallback<CartContextValue["addToCart"]>(
    ({ slug, name, roast, size, grind, basePrice, quantity = 1 }) => {
      const id = lineId(slug, size, grind);
      const unitPrice = priceForSize(basePrice, size);
      setState((prev) => {
        const existing = prev.lines.find((l) => l.id === id);
        if (existing) {
          return {
            ...prev,
            lines: prev.lines.map((l) =>
              l.id === id ? { ...l, quantity: l.quantity + quantity } : l
            ),
          };
        }
        return {
          ...prev,
          lines: [
            ...prev.lines,
            { id, slug, name, roast, size, grind, quantity, unitPrice },
          ],
        };
      });
      setMiniCartOpen(true);
    },
    []
  );

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setState((prev) => ({
      ...prev,
      lines:
        quantity <= 0
          ? prev.lines.filter((l) => l.id !== id)
          : prev.lines.map((l) => (l.id === id ? { ...l, quantity } : l)),
    }));
  }, []);

  const removeLine = useCallback((id: string) => {
    setState((prev) => ({ ...prev, lines: prev.lines.filter((l) => l.id !== id) }));
  }, []);

  const clearCart = useCallback(() => {
    setState((prev) => ({ ...prev, lines: [] }));
  }, []);

  const toggleWishlist = useCallback((slug: string) => {
    setState((prev) => ({
      ...prev,
      wishlist: prev.wishlist.includes(slug)
        ? prev.wishlist.filter((s) => s !== slug)
        : [...prev.wishlist, slug],
    }));
  }, []);

  const isWishlisted = useCallback(
    (slug: string) => state.wishlist.includes(slug),
    [state.wishlist]
  );

  const itemCount = useMemo(
    () => state.lines.reduce((sum, l) => sum + l.quantity, 0),
    [state.lines]
  );
  const subtotal = useMemo(
    () => state.lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
    [state.lines]
  );

  const value: CartContextValue = {
    lines: state.lines,
    wishlist: state.wishlist,
    itemCount,
    subtotal,
    isMiniCartOpen,
    openMiniCart: () => setMiniCartOpen(true),
    closeMiniCart: () => setMiniCartOpen(false),
    addToCart,
    updateQuantity,
    removeLine,
    clearCart,
    toggleWishlist,
    isWishlisted,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import BagPhoto from "./BagPhoto";
import { zar } from "@/lib/format";

export default function MiniCart() {
  const { lines, subtotal, isMiniCartOpen, closeMiniCart, updateQuantity, removeLine } =
    useCart();

  return (
    <AnimatePresence>
      {isMiniCartOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-espresso/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMiniCart}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cream shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-display text-xl italic text-espresso">Your cart</h2>
              <button aria-label="Close cart" onClick={closeMiniCart} className="text-espresso/70 hover:text-espresso">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <p className="font-display text-lg italic text-espresso/80">
                    Your cart is empty.
                  </p>
                  <p className="font-body text-sm text-espresso/60">
                    Good coffee is one click away.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeMiniCart}
                    className="mt-2 rounded-full bg-espresso px-5 py-2.5 font-body text-sm font-medium text-cream transition-colors hover:bg-espresso-soft"
                  >
                    Shop coffee
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {lines.map((line) => (
                    <li key={line.id} className="flex gap-4 border-b border-line pb-4">
                      <div className="h-24 w-[72px] flex-none overflow-hidden rounded-lg bg-beige/50">
                        <BagPhoto slug={line.slug} sizes="72px" />
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-body text-sm font-medium text-espresso">
                              {line.name}
                            </p>
                            <p className="font-body text-xs text-espresso/60">
                              {line.size} · {line.grind}
                            </p>
                          </div>
                          <button
                            aria-label="Remove"
                            onClick={() => removeLine(line.id)}
                            className="text-espresso/40 hover:text-caramel"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full border border-line px-2 py-1">
                            <button
                              aria-label="Decrease quantity"
                              onClick={() => updateQuantity(line.id, line.quantity - 1)}
                              className="text-espresso/70 hover:text-espresso"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-4 text-center font-body text-xs">
                              {line.quantity}
                            </span>
                            <button
                              aria-label="Increase quantity"
                              onClick={() => updateQuantity(line.id, line.quantity + 1)}
                              className="text-espresso/70 hover:text-espresso"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <span className="font-body text-sm font-medium text-espresso">
                            {zar(line.unitPrice * line.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-line px-6 py-5">
                <div className="mb-4 flex items-center justify-between font-body text-sm text-espresso/80">
                  <span>Subtotal</span>
                  <span className="font-medium text-espresso">{zar(subtotal)}</span>
                </div>
                <Link
                  href="/cart"
                  onClick={closeMiniCart}
                  className="block rounded-full border border-espresso px-5 py-3 text-center font-body text-sm font-medium text-espresso transition-colors hover:bg-espresso hover:text-cream"
                >
                  View cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeMiniCart}
                  className="mt-2 block rounded-full bg-espresso px-5 py-3 text-center font-body text-sm font-medium text-cream transition-colors hover:bg-espresso-soft"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

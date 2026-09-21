"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import BagPhoto from "@/components/BagPhoto";
import { FREE_DELIVERY_THRESHOLD, STANDARD_DELIVERY_FEE, zar } from "@/lib/format";

const VALID_CODES: Record<string, number> = {
  THABI10: 0.1,
  WELCOME15: 0.15,
};

export default function CartPage() {
  const { lines, subtotal, updateQuantity, removeLine } = useCart();
  const [code, setCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [codeError, setCodeError] = useState("");

  const discountRate = appliedCode ? VALID_CODES[appliedCode] ?? 0 : 0;
  const discount = subtotal * discountRate;
  const delivery =
    subtotal === 0 || subtotal > FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
  const total = subtotal - discount + delivery;

  function applyCode() {
    const normalized = code.trim().toUpperCase();
    if (VALID_CODES[normalized]) {
      setAppliedCode(normalized);
      setCodeError("");
    } else {
      setCodeError("That code isn't valid.");
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center sm:px-8">
        <p className="font-display text-2xl italic text-espresso">Your cart is empty.</p>
        <p className="font-body text-sm text-espresso/60">
          Good coffee is one click away.
        </p>
        <Link
          href="/shop"
          className="mt-2 rounded-full bg-espresso px-6 py-3 font-body text-sm font-medium text-cream transition-colors hover:bg-espresso-soft"
        >
          Shop coffee
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-14 sm:px-8">
      <h1 className="font-display text-4xl italic text-espresso">Your Cart</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_320px]">
        <ul className="flex flex-col gap-6">
          {lines.map((line) => (
            <li key={line.id} className="flex gap-5 border-b border-line pb-6">
              <div className="h-32 w-24 flex-none overflow-hidden rounded-xl bg-beige/40">
                <BagPhoto slug={line.slug} sizes="96px" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-body text-base font-medium text-espresso">
                      {line.name}
                    </p>
                    <p className="font-body text-sm text-espresso/60">
                      {line.size} Â· {line.grind}
                    </p>
                  </div>
                  <button
                    aria-label="Remove item"
                    onClick={() => removeLine(line.id)}
                    className="text-espresso/40 hover:text-caramel"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 rounded-full border border-line px-3 py-1.5">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(line.id, line.quantity - 1)}
                      className="text-espresso/70 hover:text-espresso"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-5 text-center font-body text-sm">{line.quantity}</span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(line.id, line.quantity + 1)}
                      className="text-espresso/70 hover:text-espresso"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-body text-base font-medium text-espresso">
                    {zar(line.unitPrice * line.quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
          <Link
            href="/shop"
            className="font-body text-sm font-medium text-espresso underline decoration-caramel decoration-2 underline-offset-4"
          >
            â† Continue shopping
          </Link>
        </ul>

        <div className="h-fit rounded-2xl bg-beige/40 p-6">
          <h2 className="font-display text-xl italic text-espresso">Order Summary</h2>

          <div className="mt-5 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Discount code"
              className="flex-1 rounded-full border border-line bg-cream px-4 py-2 font-body text-sm outline-none focus:border-espresso/40"
            />
            <button
              onClick={applyCode}
              className="rounded-full border border-espresso px-4 py-2 font-body text-sm text-espresso transition-colors hover:bg-espresso hover:text-cream"
            >
              Apply
            </button>
          </div>
          {codeError && <p className="mt-2 font-body text-xs text-caramel">{codeError}</p>}
          {appliedCode && (
            <p className="mt-2 font-body text-xs text-sage">
              Code {appliedCode} applied â€” {Math.round(discountRate * 100)}% off
            </p>
          )}
          <p className="mt-2 font-body text-[11px] text-espresso/40">
            Try THABI10 or WELCOME15
          </p>

          <div className="mt-6 flex flex-col gap-2 border-t border-line pt-4 font-body text-sm text-espresso/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{zar(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sage">
                <span>Discount</span>
                <span>-{zar(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated delivery</span>
              <span>{delivery === 0 ? "Free" : zar(delivery)}</span>
            </div>
            {delivery > 0 && (
              <p className="text-xs text-espresso/50">
                Free delivery on orders over {zar(FREE_DELIVERY_THRESHOLD, 0)}
              </p>
            )}
            <div className="mt-2 flex justify-between border-t border-line pt-3 text-base font-medium text-espresso">
              <span>Total</span>
              <span>{zar(total)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-espresso px-6 py-3.5 text-center font-body text-sm font-medium text-cream transition-colors hover:bg-espresso-soft"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

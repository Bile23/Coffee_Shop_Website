"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { zar } from "@/lib/format";

interface OrderLine {
  id: string;
  name: string;
  size: string;
  grind: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  orderNumber: string;
  name: string;
  email: string;
  address: string;
  deliveryMethod: string;
  paymentMethod: string;
  lines: OrderLine[];
  subtotal: number;
  delivery: number;
  total: number;
}

export default function ConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const raw = window.sessionStorage.getItem("coffee-with-thabi:last-order");
    if (raw) setOrder(JSON.parse(raw));
  }, []);

  if (!order) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center sm:px-8">
        <p className="font-display text-2xl italic text-espresso">
          No recent order found.
        </p>
        <Link
          href="/shop"
          className="rounded-full bg-espresso px-6 py-3 font-body text-sm font-medium text-cream"
        >
          Shop coffee
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center sm:px-8">
      <CheckCircle2 className="mx-auto text-sage" size={48} />
      <h1 className="mt-4 font-display text-4xl italic text-espresso">
        Thank you, {order.name.split(" ")[0]}.
      </h1>
      <p className="mt-2 font-body text-sm text-espresso/70">
        Your order <span className="font-medium text-espresso">{order.orderNumber}</span> is
        confirmed. A receipt was sent to {order.email}.
      </p>

      <div className="mt-8 rounded-2xl border border-line bg-beige/30 p-6 text-left">
        <ul className="flex flex-col gap-2 font-body text-sm text-espresso/80">
          {order.lines.map((l) => (
            <li key={l.id} className="flex justify-between">
              <span>
                {l.name} Ã— {l.quantity} ({l.size}, {l.grind})
              </span>
              <span>{zar(l.unitPrice * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4 font-body text-sm text-espresso/80">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{zar(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery ({order.deliveryMethod})</span>
            <span>{order.delivery === 0 ? "Free" : zar(order.delivery)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-line pt-3 text-base font-medium text-espresso">
            <span>Total</span>
            <span>{zar(order.total)}</span>
          </div>
        </div>
        <p className="mt-4 font-body text-xs text-espresso/50">
          Shipping to {order.address} Â· Paid with {order.paymentMethod}
        </p>
      </div>

      <Link
        href="/shop"
        className="mt-8 inline-block rounded-full bg-espresso px-6 py-3 font-body text-sm font-medium text-cream transition-colors hover:bg-espresso-soft"
      >
        Continue shopping
      </Link>
    </div>
  );
}

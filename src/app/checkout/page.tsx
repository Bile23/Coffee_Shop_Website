"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import {
  EXPRESS_DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  STANDARD_DELIVERY_FEE,
  zar,
} from "@/lib/format";

const STEPS = ["Contact & Delivery", "Payment", "Review"] as const;
type DeliveryMethod = "Standard (3-5 days)" | "Express (1-2 days)";
type PaymentMethod = "Card" | "PayPal" | "Apple Pay";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, clearCart } = useCart();
  const [step, setStep] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(
    "Standard (3-5 days)"
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Card");
  const [cardNumber, setCardNumber] = useState("");
  const [placing, setPlacing] = useState(false);

  const delivery =
    deliveryMethod === "Express (1-2 days)"
      ? EXPRESS_DELIVERY_FEE
      : subtotal > FREE_DELIVERY_THRESHOLD
        ? 0
        : STANDARD_DELIVERY_FEE;
  const total = subtotal + delivery;

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center sm:px-8">
        <p className="font-display text-2xl italic text-espresso">
          There&rsquo;s nothing to check out yet.
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

  function canContinueFromContact() {
    return name.trim() && email.trim() && phone.trim() && address.trim();
  }

  function placeOrder() {
    setPlacing(true);
    const orderNumber = `RC-${Math.floor(100000 + Math.random() * 900000)}`;
    const order = {
      orderNumber,
      name,
      email,
      address,
      deliveryMethod,
      paymentMethod,
      lines,
      subtotal,
      delivery,
      total,
      placedAt: new Date().toISOString(),
    };
    window.sessionStorage.setItem("coffee-with-thabi:last-order", JSON.stringify(order));
    setTimeout(() => {
      clearCart();
      router.push("/checkout/confirmation");
    }, 700);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-14 sm:px-8">
      <h1 className="font-display text-4xl italic text-espresso">Checkout</h1>

      <div className="mt-6 flex gap-6 font-body text-sm">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                i <= step ? "bg-espresso text-cream" : "bg-beige text-espresso/50"
              }`}
            >
              {i + 1}
            </span>
            <span className={i === step ? "text-espresso" : "text-espresso/40"}>{s}</span>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_320px]">
        <div>
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <Field label="Full name" value={name} onChange={setName} />
              <Field label="Email" type="email" value={email} onChange={setEmail} />
              <Field label="Phone" type="tel" value={phone} onChange={setPhone} />
              <Field label="Delivery address" value={address} onChange={setAddress} />

              <div>
                <p className="mb-2 font-body text-xs uppercase tracking-[0.15em] text-espresso/50">
                  Delivery method
                </p>
                <div className="flex flex-col gap-2">
                  {(["Standard (3-5 days)", "Express (1-2 days)"] as const).map((m) => (
                    <label
                      key={m}
                      className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 font-body text-sm text-espresso"
                    >
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === m}
                        onChange={() => setDeliveryMethod(m)}
                        className="accent-caramel"
                      />
                      {m}
                    </label>
                  ))}
                </div>
              </div>

              <button
                disabled={!canContinueFromContact()}
                onClick={() => setStep(1)}
                className="mt-2 rounded-full bg-espresso px-6 py-3 font-body text-sm font-medium text-cream transition-opacity disabled:opacity-40"
              >
                Continue to payment
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <p className="mb-2 font-body text-xs uppercase tracking-[0.15em] text-espresso/50">
                  Payment method
                </p>
                <div className="flex flex-col gap-2">
                  {(["Card", "PayPal", "Apple Pay"] as const).map((m) => (
                    <label
                      key={m}
                      className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 font-body text-sm text-espresso"
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === m}
                        onChange={() => setPaymentMethod(m)}
                        className="accent-caramel"
                      />
                      {m}
                    </label>
                  ))}
                </div>
              </div>

              {paymentMethod === "Card" && (
                <Field
                  label="Card number"
                  value={cardNumber}
                  onChange={setCardNumber}
                  placeholder="4242 4242 4242 4242"
                />
              )}
              <p className="font-body text-xs text-espresso/45">
                No real payment gateway is connected â€” this is a placeholder
                checkout for demonstration.
              </p>

              <div className="mt-2 flex gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="rounded-full border border-line px-6 py-3 font-body text-sm text-espresso"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="rounded-full bg-espresso px-6 py-3 font-body text-sm font-medium text-cream"
                >
                  Review order
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div className="rounded-xl border border-line p-5 font-body text-sm text-espresso/80">
                <p className="font-medium text-espresso">{name}</p>
                <p>{address}</p>
                <p>{email} Â· {phone}</p>
                <p className="mt-2 text-espresso/60">{deliveryMethod}</p>
                <p className="text-espresso/60">Paying with {paymentMethod}</p>
              </div>
              <ul className="flex flex-col gap-2 font-body text-sm text-espresso/80">
                {lines.map((l) => (
                  <li key={l.id} className="flex justify-between">
                    <span>
                      {l.name} Ã— {l.quantity} ({l.size}, {l.grind})
                    </span>
                    <span>{zar(l.unitPrice * l.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="rounded-full border border-line px-6 py-3 font-body text-sm text-espresso"
                >
                  Back
                </button>
                <button
                  onClick={placeOrder}
                  disabled={placing}
                  className="rounded-full bg-espresso px-6 py-3 font-body text-sm font-medium text-cream disabled:opacity-60"
                >
                  {placing ? "Placing orderâ€¦" : "Place order"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-fit rounded-2xl bg-beige/40 p-6">
          <h2 className="font-display text-xl italic text-espresso">Order Summary</h2>
          <ul className="mt-4 flex flex-col gap-2 font-body text-sm text-espresso/75">
            {lines.map((l) => (
              <li key={l.id} className="flex justify-between">
                <span>{l.name} Ã— {l.quantity}</span>
                <span>{zar(l.unitPrice * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4 font-body text-sm text-espresso/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{zar(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{delivery === 0 ? "Free" : zar(delivery)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-line pt-3 text-base font-medium text-espresso">
              <span>Total</span>
              <span>{zar(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-body text-xs uppercase tracking-[0.15em] text-espresso/50">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-line bg-cream px-4 py-3 font-body text-sm outline-none focus:border-espresso/40"
      />
    </label>
  );
}

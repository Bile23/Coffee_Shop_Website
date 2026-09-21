"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-8">
        <h2 className="font-display text-3xl text-center text-white">
          Join our mailing list
        </h2>
        <p className="mx-auto mt-4 max-w-md font-body text-sm text-white/70">
          New arrivals, seasonal lots, and the occasional brewing tip. No spam,
          just coffee.
        </p>

        {submitted ? (
          <p className="mt-6 font-body text-sm font-medium text-white">
            You&rsquo;re on the list — welcome.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setSubmitted(true);
            }}
            className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="flex-1 rounded-full border border-white/30 bg-transparent px-5 py-3 font-body text-sm text-white outline-none placeholder:text-white/40 focus:border-caramel"
            />
            <button
              type="submit"
              className="rounded-full bg-caramel px-6 py-3 font-body text-sm font-medium text-white transition-colors hover:bg-caramel-bright"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

// Sequence (seconds): bean falls 0.5 → 2.05, lands and sinks, video reveals from the cup.
const REVEAL_AT = 2350;
const SCROLL_UNLOCK_AT = 3600;

const DROPLETS = [
  { dx: -46, rise: -34, size: 7 },
  { dx: -22, rise: -48, size: 5 },
  { dx: 6, rise: -56, size: 6 },
  { dx: 30, rise: -44, size: 5 },
  { dx: 52, rise: -30, size: 7 },
];

export default function FallingBeanHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const body = document.body;
    if (!reduced) body.style.overflow = "hidden";

    const video = videoRef.current;
    let cancelled = false;
    let fallback = 0;

    function reveal() {
      if (cancelled) return;
      window.clearTimeout(fallback);
      setRevealed(true);
      video?.play().catch(() => {});
    }

    // The hero video is large, so hold the intro until enough of it has buffered to play smoothly.
    const revealTimer = window.setTimeout(
      () => {
        if (!video || video.readyState >= 3) {
          reveal();
          return;
        }
        video.addEventListener("canplay", reveal, { once: true });
        fallback = window.setTimeout(reveal, 8000);
      },
      reduced ? 0 : REVEAL_AT
    );
    const unlockTimer = window.setTimeout(
      () => {
        body.style.overflow = "";
      },
      reduced ? 0 : SCROLL_UNLOCK_AT
    );

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      video?.removeEventListener("canplay", reveal);
      window.clearTimeout(revealTimer);
      window.clearTimeout(unlockTimer);
      body.style.overflow = "";
    };
  }, []);

  return (
    <section className="relative h-[calc(100svh-110px)] min-h-[560px] overflow-hidden bg-espresso">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          clipPath: revealed ? "circle(150vmax at 50% 60%)" : "circle(0px at 50% 60%)",
          transition: "clip-path 1.4s cubic-bezier(0.65, 0, 0.35, 1)",
        }}
      >
        <source src="/video/hero-0919.mp4" type="video/mp4" />
      </video>
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10 transition-opacity duration-1000"
        style={{ opacity: revealed ? 1 : 0 }}
      />

      <div
        className="absolute inset-0 flex items-center transition-all duration-1000"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(24px)",
          transitionDelay: revealed ? "0.9s" : "0s",
        }}
      >
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            Small batch · Roasted weekly
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-5xl leading-[1.05] text-white sm:text-6xl">
            Every cup has a story.
          </h2>
          <p className="mt-5 max-w-md font-body text-base leading-7 text-white/80">
            From the hillside to your morning — meet the farmers behind every
            bean we roast.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-caramel px-7 py-3.5 font-body text-sm font-semibold text-white transition-colors hover:bg-caramel-bright"
            >
              Shop Coffee
            </Link>
            <Link
              href="/beans"
              className="rounded-full border border-white/50 px-7 py-3.5 font-body text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Meet the Beans
            </Link>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-700"
        style={{ opacity: revealed ? 0 : 1, transitionDelay: revealed ? "0.8s" : "0s" }}
        aria-hidden={revealed}
      >
        <div className="absolute inset-x-0 top-[10%] text-center">
          <h1
            className="font-wordmark text-4xl font-medium uppercase tracking-[0.06em] text-white sm:text-6xl"
            style={{ animation: "fadeUp 0.8s ease-out both" }}
          >
            Coffee with Thabi<span className="text-caramel">.</span>
          </h1>
          <div
            className="mx-auto mt-3 h-[2px] w-40 bg-caramel sm:w-56"
            style={{ animation: "fadeUp 0.8s ease-out 0.15s both" }}
          />
          <p
            className="mt-5 font-body text-xs font-medium uppercase tracking-[0.25em] text-white/75 sm:text-sm"
            style={{ animation: "fadeUp 0.8s ease-out 0.3s both" }}
          >
            People · Places · Better coffee
          </p>
        </div>

        <div className="absolute inset-x-0 top-0" style={{ height: "calc(58% + 26px)" }}>
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 overflow-hidden">
            <div className="bean-trail absolute left-0 top-0 h-full w-[3px] -translate-x-1/2 bg-gradient-to-b from-transparent via-white/50 to-white/0 blur-[1px]" />
          </div>
          <div className="overflow-hidden absolute inset-0">
            <div className="bean-fall absolute left-1/2 z-10">
              <Bean />
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 top-[58%] -translate-x-1/2">
          <div className="cup-impact relative">
            <Cup />

            <span
              aria-hidden
              className="surface-shadow absolute left-1/2 top-[26px] h-4 w-20 rounded-full bg-black/60 blur-[3px]"
            />
            {[0, 0.2, 0.4].map((d, i) => (
              <span
                key={i}
                aria-hidden
                className="ring-out absolute left-1/2 top-[15px] h-[22px] rounded-full border-2 border-white/80"
                style={{ width: 118, animationDelay: `${2.05 + d}s` }}
              />
            ))}
            {DROPLETS.map((d, i) => (
              <span
                key={i}
                aria-hidden
                className="droplet-arc absolute left-1/2 top-[22px]"
                style={{ ["--dx" as string]: `${d.dx}px`, ["--rise" as string]: `${d.rise}px` }}
              >
                <span
                  className="droplet block rounded-full bg-[#3a2015]"
                  style={{ width: d.size, height: d.size, animationDelay: "2.05s" }}
                />
              </span>
            ))}

            <div
              aria-hidden
              className="absolute -top-11 left-1/2 flex -translate-x-1/2 gap-3"
              style={{ animation: "fadeUp 0.8s ease-out 2.5s both" }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="steam block h-10 w-1.5 rounded-full bg-white/60"
                  style={{ animationDelay: `${2.6 + i * 0.35}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center text-white/80 transition-opacity duration-700"
        style={{ opacity: revealed ? 1 : 0, transitionDelay: revealed ? "1.8s" : "0s" }}
      >
        <ChevronDown className="chevron-bob" size={26} />
      </div>
    </section>
  );
}

function Bean() {
  return (
    <svg width="46" height="60" viewBox="0 0 20 26" fill="none">
      <defs>
        <linearGradient id="heroBean" x1="3" y1="2" x2="17" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#d9a866" />
          <stop offset="0.5" stopColor="#8a5530" />
          <stop offset="1" stopColor="#3a2013" />
        </linearGradient>
      </defs>
      <path d="M10 1c5 0 9 5 9 12s-4 12-9 12-9-5-9-12S5 1 10 1Z" fill="url(#heroBean)" />
      <path d="M10 2.5c-2.6 4-2.6 15.5 0 20" stroke="#120904" strokeWidth="1.2" strokeLinecap="round" />
      <ellipse cx="6.8" cy="6.5" rx="2.2" ry="1.4" fill="#fff" opacity="0.28" />
    </svg>
  );
}

function Cup() {
  return (
    <svg width="190" height="150" viewBox="0 0 190 150" fill="none" aria-hidden>
      <ellipse cx="95" cy="138" rx="88" ry="9" fill="#000" opacity="0.18" />
      <ellipse cx="95" cy="132" rx="82" ry="10" fill="#fff" />
      <path d="M30 24h130l-10 78c-2 14-12 24-26 24H66c-14 0-24-10-26-24z" fill="#fff" />
      <path d="M40 40l6 60c1 8 6 14 12 18" stroke="#000" strokeOpacity="0.06" strokeWidth="10" strokeLinecap="round" />
      <path d="M158 40c26 0 30 40 0 44" stroke="#fff" strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="95" cy="24" rx="65" ry="12" fill="#f2ebe3" />
      <ellipse cx="95" cy="26" rx="58" ry="9" fill="#3a2015" />
      <ellipse cx="80" cy="24" rx="18" ry="3" fill="#6b4630" opacity="0.7" />
    </svg>
  );
}

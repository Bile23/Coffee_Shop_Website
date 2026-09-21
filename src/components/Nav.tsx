"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import Wordmark from "./Wordmark";

const LINKS = [
  { href: "/shop", label: "Shop Coffee" },
  { href: "/beans", label: "Our Beans" },
  { href: "/dashboard", label: "Coffee Insights" },
  { href: "/cart", label: "Cart" },
];

export default function Nav() {
  const { itemCount, openMiniCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-black transition-[padding] duration-200 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6 sm:px-8">
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="flex w-fit items-center gap-3 text-white"
          >
            <Menu size={26} strokeWidth={1.5} />
            <span className="hidden font-body text-xs font-medium uppercase tracking-[0.12em] sm:inline">
              Menu
            </span>
          </button>

          <Link href="/" aria-label="Coffee with Thabi, home" className="justify-self-center">
            <Wordmark />
          </Link>

          <button
            aria-label="Open cart"
            onClick={openMiniCart}
            className="relative justify-self-end text-white"
          >
            <ShoppingBag size={24} strokeWidth={1.5} />
            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-sm bg-white px-1 text-[10px] font-semibold text-black">
              {itemCount}
            </span>
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-200 ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
        <nav
          className={`absolute inset-y-0 left-0 flex w-full max-w-sm flex-col bg-black px-8 py-6 text-white transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="mb-10 w-fit text-white"
          >
            <X size={26} strokeWidth={1.5} />
          </button>
          <ul className="flex flex-col gap-6">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  tabIndex={menuOpen ? 0 : -1}
                  className="font-display text-3xl transition-colors hover:text-caramel"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-auto font-body text-xs text-white/50">
            People · Places · Better coffee
          </p>
        </nav>
      </div>
    </>
  );
}

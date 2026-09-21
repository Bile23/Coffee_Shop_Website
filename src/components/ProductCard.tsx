"use client";

import Link from "next/link";
import { Star, Heart, Plus } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import BagPhoto from "./BagPhoto";
import { zar } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const wishlisted = isWishlisted(product.slug);

  return (
    <div className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-beige/40">
        <Link href={`/shop/${product.slug}`} className="block h-full">
          <BagPhoto
            slug={product.slug}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <button
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggleWishlist(product.slug)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-cream/90 text-espresso/70 shadow-sm transition-colors hover:text-caramel"
        >
          <Heart size={15} fill={wishlisted ? "currentColor" : "none"} className={wishlisted ? "text-caramel" : ""} />
        </button>
        {product.bestSeller && (
          <span className="absolute left-3 top-3 rounded-sm bg-espresso px-2.5 py-1 font-body text-[10px] uppercase tracking-wide text-cream">
            Best seller
          </span>
        )}
        <button
          onClick={() =>
            addToCart({
              slug: product.slug,
              name: product.name,
              roast: product.roast,
              size: "250g",
              grind: "Whole Bean",
              basePrice: product.price,
            })
          }
          className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-1.5 rounded-full bg-espresso py-2.5 font-body text-xs font-medium text-cream opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Plus size={13} /> Quick add
        </button>
      </div>

      <Link href={`/shop/${product.slug}`} className="mt-4 text-center">
        <h3 className="font-display text-base font-medium text-espresso">{product.name}</h3>
      </Link>
      <p className="mt-1 text-center font-body text-xs text-espresso/60">
        {product.origin} · {product.roast} roast
      </p>
      <p className="mt-1 text-center font-body text-xs text-espresso/50">{product.tastingNotes}</p>

      <div className="mt-2 flex items-center justify-center gap-4">
        <span className="font-body text-sm font-medium text-espresso">
          {zar(product.price)}
        </span>
        <div className="flex items-center gap-1 text-caramel">
          <Star size={12} fill="currentColor" />
          <span className="font-body text-xs text-espresso/70">
            {product.rating} ({product.reviewCount})
          </span>
        </div>
      </div>
    </div>
  );
}

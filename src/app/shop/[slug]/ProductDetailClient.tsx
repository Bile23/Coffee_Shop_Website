"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Heart, Minus, Plus } from "lucide-react";
import {
  getRelatedProducts,
  priceForSize,
  RANGE_IMAGE,
  type Product,
  type Size,
  type GrindOption,
} from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { getBeanStory } from "@/lib/bean-stories";
import Image from "next/image";
import { zar } from "@/lib/format";
import ProductCard from "@/components/ProductCard";

const SIZES: Size[] = ["250g", "500g", "1kg"];
const GRINDS: GrindOption[] = ["Whole Bean", "Espresso", "Filter", "French Press"];

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [size, setSize] = useState<Size>("250g");
  const [grind, setGrind] = useState<GrindOption>("Whole Bean");
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<"story" | "description" | "brewing" | "reviews">("story");
  const beanStory = getBeanStory(product.slug);
  const gallery = [
    {
      src: product.images[0],
      alt: `${product.name} coffee bag, ${product.roast.toLowerCase()} roast, 250g`,
      label: `${product.name} bag`,
    },
    {
      src: RANGE_IMAGE,
      alt: "The Coffee with Thabi range of coffee bags on a stone counter",
      label: "The full range",
    },
  ];
  const [activeImage, setActiveImage] = useState(0);

  const price = priceForSize(product.price, size);
  const related = getRelatedProducts(product);
  const wishlisted = isWishlisted(product.slug);

  function handleAddToCart() {
    addToCart({
      slug: product.slug,
      name: product.name,
      roast: product.roast,
      size,
      grind,
      basePrice: product.price,
      quantity,
    });
  }

  function handleBuyNow() {
    handleAddToCart();
    router.push("/checkout");
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <div
            className={`relative overflow-hidden rounded-3xl bg-beige/40 ${
              activeImage === 0 ? "aspect-[3/4]" : "aspect-[3/2]"
            }`}
          >
            <Image
              src={gallery[activeImage].src}
              alt={gallery[activeImage].alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="mt-4 flex gap-3">
            {gallery.map((g, i) => (
              <button
                key={g.src}
                onClick={() => setActiveImage(i)}
                aria-label={g.label}
                className={`relative h-20 w-16 overflow-hidden rounded-xl border-2 ${
                  activeImage === i ? "border-caramel" : "border-transparent"
                }`}
              >
                <Image src={g.src} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-body text-xs uppercase tracking-[0.15em] text-caramel">
            {product.origin} · {product.roast} roast
          </p>
          <h1 className="mt-2 font-display text-4xl italic text-espresso">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex gap-0.5 text-caramel">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.round(product.rating) ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="font-body text-sm text-espresso/60">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          <p className="mt-4 font-body text-2xl font-medium text-espresso">
            {zar(price)}
          </p>

          <p className="mt-4 max-w-md font-body text-sm leading-6 text-espresso/70">
            {product.description}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 font-body text-sm">
            <div>
              <dt className="text-espresso/50">Region</dt>
              <dd className="text-espresso">{product.region}</dd>
            </div>
            <div>
              <dt className="text-espresso/50">Altitude</dt>
              <dd className="text-espresso">{product.altitude}</dd>
            </div>
            <div>
              <dt className="text-espresso/50">Process</dt>
              <dd className="text-espresso">{product.process}</dd>
            </div>
            <div>
              <dt className="text-espresso/50">Tasting notes</dt>
              <dd className="text-espresso">{product.tastingNotes}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <p className="mb-2 font-body text-xs uppercase tracking-[0.15em] text-espresso/50">
              Size
            </p>
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`rounded-full border px-4 py-2 font-body text-sm transition-colors ${
                    size === s
                      ? "border-espresso bg-espresso text-cream"
                      : "border-line text-espresso/70 hover:border-espresso/40"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 font-body text-xs uppercase tracking-[0.15em] text-espresso/50">
              Grind
            </p>
            <div className="flex flex-wrap gap-2">
              {GRINDS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGrind(g)}
                  className={`rounded-full border px-4 py-2 font-body text-sm transition-colors ${
                    grind === g
                      ? "border-espresso bg-espresso text-cream"
                      : "border-line text-espresso/70 hover:border-espresso/40"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-full border border-line px-3 py-2">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="text-espresso/70 hover:text-espresso"
              >
                <Minus size={14} />
              </button>
              <span className="w-5 text-center font-body text-sm">{quantity}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => q + 1)}
                className="text-espresso/70 hover:text-espresso"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={() => toggleWishlist(product.slug)}
              aria-label="Toggle wishlist"
              className="flex items-center gap-2 rounded-full border border-line px-4 py-2.5 font-body text-sm text-espresso/70 transition-colors hover:border-caramel"
            >
              <Heart size={15} fill={wishlisted ? "currentColor" : "none"} className={wishlisted ? "text-caramel" : ""} />
              Wishlist
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 rounded-full bg-espresso px-6 py-3.5 font-body text-sm font-medium text-cream transition-colors hover:bg-espresso-soft"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 rounded-full border border-espresso px-6 py-3.5 font-body text-sm font-medium text-espresso transition-colors hover:bg-espresso hover:text-cream"
            >
              Buy Now
            </button>
          </div>

        </div>
      </div>

      <div className="mt-16 border-t border-line">
        <div className="flex gap-8 pt-6">
          {(["story", "description", "brewing", "reviews"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-body text-sm capitalize transition-colors ${
                tab === t ? "font-medium text-espresso" : "text-espresso/50"
              }`}
            >
              {t === "brewing" ? "Recommended Brewing" : t}
            </button>
          ))}
        </div>

        <div className="mt-6 max-w-2xl font-body text-sm leading-6 text-espresso/75">
          {tab === "story" && beanStory && (
            <div className="flex flex-col gap-4">
              <p className="font-display text-lg text-espresso">{beanStory.headline}</p>
              <p className="text-xs text-espresso/50">
                Grown by {beanStory.farmer} · {beanStory.farm} · Harvest {beanStory.harvest}
              </p>
              {beanStory.story.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              <blockquote className="border-l-4 border-caramel pl-4 italic text-espresso/80">
                “{beanStory.quote}”
              </blockquote>
            </div>
          )}
          {tab === "description" && <p>{product.description}</p>}
          {tab === "brewing" && (
            <div className="flex flex-wrap gap-3">
              {product.recommendedBrewMethods.map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-line bg-beige/30 px-4 py-2 font-body text-sm text-espresso"
                >
                  {m}
                </span>
              ))}
            </div>
          )}
          {tab === "reviews" && (
            <div className="flex flex-col gap-5">
              {product.reviews.length === 0 ? (
                <p className="text-espresso/60">No reviews yet — be the first.</p>
              ) : (
                product.reviews.map((r) => (
                  <div key={r.id} className="border-b border-line pb-5">
                    <div className="flex gap-0.5 text-caramel">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" />
                      ))}
                    </div>
                    <p className="mt-2 font-medium text-espresso">{r.title}</p>
                    <p className="mt-1 text-espresso/70">{r.body}</p>
                    <p className="mt-2 text-xs text-espresso/50">
                      {r.author} · {r.date}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="font-display text-2xl italic text-espresso">You might also like</h2>
        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

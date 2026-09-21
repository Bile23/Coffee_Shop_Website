import Link from "next/link";
import { products } from "@/lib/products";
import { getBeanStory } from "@/lib/bean-stories";
import FallingBeanHero from "@/components/FallingBeanHero";
import ProductCard from "@/components/ProductCard";
import Newsletter from "@/components/Newsletter";
import BagPhoto from "@/components/BagPhoto";
import Image from "next/image";
import { RANGE_IMAGE } from "@/lib/products";

const featured = products.filter((p) => p.bestSeller).slice(0, 4);
const storyBeans = products.slice(0, 3);

const roasts = [
  {
    level: "Light",
    slug: "kenya-aa",
    blurb: "Bright, fruity and floral. Berries, citrus and tea-like clarity.",
  },
  {
    level: "Medium",
    slug: "house-blend",
    blurb: "Balanced and sweet. Chocolate, caramel and nuts. The everyday cup.",
  },
  {
    level: "Dark",
    slug: "dark-roast",
    blurb: "Bold and rich. Dark chocolate and spice, made for milk and espresso.",
  },
];

export default function Home() {
  return (
    <>
      <FallingBeanHero />

      <section className="mx-auto max-w-7xl px-6 pt-16 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="relative aspect-[3/2] sm:aspect-[16/9]">
            <Image
              src={RANGE_IMAGE}
              alt="The Coffee with Thabi range: five coffee bags in cream, green, black, tan and pink standing on a stone counter"
              fill
              sizes="(min-width: 1280px) 1216px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="bg-espresso px-6 py-6 text-white sm:absolute sm:inset-x-0 sm:bottom-0 sm:bg-gradient-to-t sm:from-espresso/90 sm:to-transparent sm:px-10 sm:pb-8 sm:pt-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-white/70">
                  People · Places · Better coffee
                </p>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl">
                  The Coffee with Thabi range
                </h2>
              </div>
              <Link
                href="/shop"
                className="rounded-full bg-caramel px-6 py-3 font-body text-sm font-semibold text-white transition-colors hover:bg-caramel-bright"
              >
                Shop all bags
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-20 sm:px-8">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-caramel">
          Shop by roast
        </p>
        <h2 className="mt-2 font-display text-3xl text-espresso">Find your roast</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {roasts.map((r) => (
            <Link
              key={r.level}
              href={`/shop?roast=${r.level}`}
              className="group flex items-center gap-5 overflow-hidden rounded-3xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-36 w-28 flex-none overflow-hidden rounded-2xl">
                <BagPhoto
                  slug={r.slug}
                  sizes="112px"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div>
                <h3 className="font-display text-xl text-espresso">{r.level} roast</h3>
                <p className="mt-1 font-body text-sm leading-6 text-espresso/65">{r.blurb}</p>
                <span className="mt-3 inline-block font-body text-sm font-semibold text-caramel">
                  Shop {r.level.toLowerCase()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-caramel">
              Favourites
            </p>
            <h2 className="mt-2 font-display text-3xl text-espresso">
              What everyone keeps reordering
            </h2>
          </div>
          <Link
            href="/shop"
            className="font-body text-sm font-semibold text-caramel underline underline-offset-4"
          >
            Shop all coffee
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="bg-beige/60">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-caramel">
            Every bean has a story
          </p>
          <h2 className="mt-2 max-w-xl font-display text-3xl text-espresso">
            Meet the farmers behind your cup
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {storyBeans.map((p) => {
              const story = getBeanStory(p.slug);
              if (!story) return null;
              return (
                <Link
                  key={p.slug}
                  href={`/beans#${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="aspect-[4/5] bg-beige">
                    <BagPhoto slug={p.slug} sizes="(min-width: 768px) 33vw, 100vw" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="font-body text-xs font-semibold uppercase tracking-[0.12em] text-caramel">
                      {p.origin}
                    </p>
                    <h3 className="mt-1 font-display text-xl text-espresso">{story.headline}</h3>
                    <p className="mt-2 font-body text-sm text-espresso/65">
                      {story.farmer} · {story.farm}
                    </p>
                    <span className="mt-4 font-body text-sm font-semibold text-caramel">
                      Read the story
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-espresso text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-20 sm:px-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-white/60">
              Coffee insights
            </p>
            <h2 className="mt-2 font-display text-3xl">See what&rsquo;s selling, and when</h2>
            <p className="mt-4 max-w-md font-body text-base leading-7 text-white/75">
              Our live dashboard tracks the best-selling beans, the busiest
              days and the peak hour we all reach for a cup. Click into any
              chart to explore the detail.
            </p>
            <Link
              href="/dashboard"
              className="mt-6 inline-block rounded-full bg-caramel px-6 py-3 font-body text-sm font-semibold text-white transition-colors hover:bg-caramel-bright"
            >
              Open the dashboard
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["Peak day", "Peak time", "Best seller"].map((label) => (
              <div key={label} className="rounded-2xl bg-white/10 p-4 text-center">
                <p className="font-body text-xs text-white/60">{label}</p>
                <p className="mt-2 font-display text-lg">Explore</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}

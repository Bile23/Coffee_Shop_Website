import Link from "next/link";
import { products } from "@/lib/products";
import { getBeanStory } from "@/lib/bean-stories";
import BagPhoto from "@/components/BagPhoto";

export const metadata = { title: "Our Beans — Coffee with Thabi" };

export default function BeansPage() {
  return (
    <>
      <section className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            Our beans
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl sm:text-5xl">
            Six bags. Six farmers. Six stories worth sipping.
          </h1>
          <p className="mt-5 max-w-xl font-body text-base leading-7 text-white/85">
            We never buy anonymous coffee. Every bean on our shelf can be traced
            to a person, a hillside and a harvest — here is who they are.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="flex flex-col gap-20">
          {products.map((p, i) => {
            const story = getBeanStory(p.slug);
            if (!story) return null;
            const flip = i % 2 === 1;
            return (
              <article
                key={p.slug}
                id={p.slug}
                className="grid items-center gap-10 lg:grid-cols-2"
              >
                <div className={flip ? "lg:order-2" : ""}>
                  <div className="mx-auto aspect-[3/4] max-w-md overflow-hidden rounded-3xl bg-beige">
                    <BagPhoto slug={p.slug} sizes="(min-width: 1024px) 448px, 90vw" />
                  </div>
                </div>
                <div>
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-caramel">
                    {p.origin} · {p.roast} roast · Harvest {story.harvest}
                  </p>
                  <h2 className="mt-2 font-display text-3xl text-espresso">{p.name}</h2>
                  <p className="mt-1 font-body text-sm text-espresso/60">
                    Grown by {story.farmer}, {story.farm}
                  </p>
                  <h3 className="mt-6 font-display text-xl text-espresso">
                    {story.headline}
                  </h3>
                  <p className="mt-3 font-body text-base leading-7 text-espresso/75">
                    {story.story[0]}
                  </p>
                  <blockquote className="mt-5 border-l-4 border-caramel pl-4 font-body text-base italic text-espresso/80">
                    “{story.quote}”
                  </blockquote>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/shop/${p.slug}`}
                      className="rounded-full bg-caramel px-6 py-3 font-body text-sm font-semibold text-white transition-colors hover:bg-caramel-bright"
                    >
                      Read the full story &amp; shop
                    </Link>
                    <span className="self-center font-body text-sm text-espresso/60">
                      Tastes like {p.tastingNotes.toLowerCase()}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}

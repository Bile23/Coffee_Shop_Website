"use client";

import { useMemo, useState } from "react";
import { zar } from "@/lib/format";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import {
  products,
  type RoastLevel,
  type FlavorProfile,
} from "@/lib/products";
import ProductCard from "@/components/ProductCard";

type SortOption =
  | "Best Selling"
  | "Newest"
  | "Price Low to High"
  | "Price High to Low"
  | "Customer Rating";

const ROASTS: RoastLevel[] = ["Light", "Medium", "Dark"];
const FLAVORS: FlavorProfile[] = [
  "Fruity",
  "Chocolatey",
  "Nutty",
  "Caramel",
  "Bold",
];
const SORTS: SortOption[] = [
  "Best Selling",
  "Newest",
  "Price Low to High",
  "Price High to Low",
  "Customer Rating",
];

export default function ShopClient() {
  const searchParams = useSearchParams();
  const initialRoast = searchParams.get("roast") as RoastLevel | null;

  const origins = useMemo(
    () => Array.from(new Set(products.map((p) => p.origin))).sort(),
    []
  );

  const [query, setQuery] = useState("");
  const [roasts, setRoasts] = useState<RoastLevel[]>(
    initialRoast ? [initialRoast] : []
  );
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [flavors, setFlavors] = useState<FlavorProfile[]>([]);
  const [maxPrice, setMaxPrice] = useState(250);
  const [format, setFormat] = useState<"All" | "Whole Bean" | "Ground">("All");
  const [sort, setSort] = useState<SortOption>("Best Selling");

  function toggle<T>(list: T[], value: T, setList: (v: T[]) => void) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (roasts.length && !roasts.includes(p.roast)) return false;
      if (selectedOrigins.length && !selectedOrigins.includes(p.origin)) return false;
      if (flavors.length && !p.flavors.some((f) => flavors.includes(f))) return false;
      if (p.price > maxPrice) return false;
      return true;
    });

    switch (sort) {
      case "Best Selling":
        result = [...result].sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller));
        break;
      case "Newest":
        result = [...result].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "Price Low to High":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "Price High to Low":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "Customer Rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
    }
    return result;
  }, [query, roasts, selectedOrigins, flavors, maxPrice, sort]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8">
      <div className="mb-10">
        <p className="font-body text-xs uppercase tracking-[0.15em] text-caramel">Shop</p>
        <h1 className="mt-2 font-display text-4xl italic text-espresso">All Coffee</h1>
        <p className="mt-2 max-w-md font-body text-sm text-espresso/60">
          {filtered.length} coffee{filtered.length === 1 ? "" : "s"} · roasted to order
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="flex flex-col gap-8">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso/40"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search coffee"
              className="w-full rounded-full border border-line bg-cream py-2.5 pl-9 pr-4 font-body text-sm outline-none focus:border-espresso/40"
            />
          </div>

          <div>
            <p className="mb-3 font-body text-xs uppercase tracking-[0.15em] text-espresso/50">
              Roast
            </p>
            <div className="flex flex-col gap-2">
              {ROASTS.map((r) => (
                <label key={r} className="flex items-center gap-2 font-body text-sm text-espresso/80">
                  <input
                    type="checkbox"
                    checked={roasts.includes(r)}
                    onChange={() => toggle(roasts, r, setRoasts)}
                    className="accent-caramel"
                  />
                  {r}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 font-body text-xs uppercase tracking-[0.15em] text-espresso/50">
              Origin
            </p>
            <div className="flex flex-col gap-2">
              {origins.map((o) => (
                <label key={o} className="flex items-center gap-2 font-body text-sm text-espresso/80">
                  <input
                    type="checkbox"
                    checked={selectedOrigins.includes(o)}
                    onChange={() => toggle(selectedOrigins, o, setSelectedOrigins)}
                    className="accent-caramel"
                  />
                  {o}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 font-body text-xs uppercase tracking-[0.15em] text-espresso/50">
              Flavor profile
            </p>
            <div className="flex flex-wrap gap-2">
              {FLAVORS.map((f) => (
                <button
                  key={f}
                  onClick={() => toggle(flavors, f, setFlavors)}
                  className={`rounded-full border px-3 py-1.5 font-body text-xs transition-colors ${
                    flavors.includes(f)
                      ? "border-espresso bg-espresso text-cream"
                      : "border-line text-espresso/70 hover:border-espresso/40"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 font-body text-xs uppercase tracking-[0.15em] text-espresso/50">
              Max price · {zar(maxPrice, 0)}
            </p>
            <input
              type="range"
              min={150}
              max={250}
              step={5}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-caramel"
            />
          </div>

          <div>
            <p className="mb-3 font-body text-xs uppercase tracking-[0.15em] text-espresso/50">
              Format
            </p>
            <div className="flex gap-2">
              {(["All", "Whole Bean", "Ground"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`rounded-full border px-3 py-1.5 font-body text-xs transition-colors ${
                    format === f
                      ? "border-espresso bg-espresso text-cream"
                      : "border-line text-espresso/70 hover:border-espresso/40"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-end gap-3">
            <label className="font-body text-xs text-espresso/60">Sort by</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-full border border-line bg-cream px-3 py-2 font-body text-sm text-espresso outline-none"
            >
              {SORTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-beige/30 py-20 text-center">
              <p className="font-display text-lg italic text-espresso">
                No coffee matches those filters.
              </p>
              <p className="font-body text-sm text-espresso/60">
                Try widening your price range or clearing a filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

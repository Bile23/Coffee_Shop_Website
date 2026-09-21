import { products, priceForSize, type Size } from "./products";

export interface Sale {
  id: string;
  date: string; // YYYY-MM-DD
  hour: number; // 0-23
  weekday: number; // 0 = Sunday
  beanSlug: string;
  units: number;
  revenue: number;
  channel: "In-store" | "Online";
  size: Size;
}

// To use a real dataset, replace the body of getSales() with your own records
// mapped to the Sale shape above. Nothing else in the dashboard needs to change.
export function getSales(): Sale[] {
  return generateSales();
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickWeighted<T>(items: T[], weights: number[], rand: () => number): T {
  const total = weights.reduce((s, w) => s + w, 0);
  let r = rand() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

const WEEKDAY_WEIGHT = [0.7, 0.85, 0.9, 0.95, 1.05, 1.35, 1.5]; // Sun..Sat
const HOUR_WEIGHT: Record<number, number> = {
  7: 1.6, 8: 2.4, 9: 2.0, 10: 1.4, 11: 1.2, 12: 1.5, 13: 1.3,
  14: 1.0, 15: 1.1, 16: 0.9, 17: 0.5,
};
const BEAN_BASE: Record<string, number> = {
  "house-blend": 1.7,
  "dark-roast": 1.2,
  "brazil-santos": 1.3,
  "kenya-aa": 0.9,
  "kenya-nyeri": 0.7,
  "arabic-blend": 0.6,
};

// Southern hemisphere seasons: light, fruity coffees sell in summer; dark ones in winter.
function seasonBoost(roast: string, month: number): number {
  const winter = month >= 5 && month <= 7;
  const summer = month === 11 || month <= 1;
  if (roast === "Dark") return winter ? 1.5 : summer ? 0.7 : 1;
  if (roast === "Light") return summer ? 1.4 : winter ? 0.8 : 1;
  return 1;
}

export function generateSales(): Sale[] {
  const rand = mulberry32(20260919);
  const sales: Sale[] = [];
  const end = new Date("2026-09-18T00:00:00");
  const days = 365;
  const sizes: Size[] = ["250g", "500g", "1kg"];
  const sizeWeights = [0.6, 0.3, 0.1];
  const hours = Object.keys(HOUR_WEIGHT).map(Number);
  const hourWeights = hours.map((h) => HOUR_WEIGHT[h]);
  let n = 0;

  for (let d = days - 1; d >= 0; d--) {
    const day = new Date(end);
    day.setDate(end.getDate() - d);
    const weekday = day.getDay();
    const month = day.getMonth();
    const growth = 0.75 + ((days - d) / days) * 0.5; // business grows over the year
    const orders = Math.round((16 + rand() * 8) * WEEKDAY_WEIGHT[weekday] * growth);
    const iso = day.toISOString().slice(0, 10);

    for (let i = 0; i < orders; i++) {
      const beanWeights = products.map(
        (p) => (BEAN_BASE[p.slug] ?? 1) * seasonBoost(p.roast, month) * (p.bestSeller ? 1.15 : 1)
      );
      const bean = pickWeighted(products, beanWeights, rand);
      const size = pickWeighted(sizes, sizeWeights, rand);
      const units = rand() < 0.8 ? 1 : rand() < 0.7 ? 2 : 3;
      const hour = pickWeighted(hours, hourWeights, rand);
      const channel = rand() < 0.62 ? "In-store" : "Online";
      sales.push({
        id: `s${n++}`,
        date: iso,
        hour,
        weekday,
        beanSlug: bean.slug,
        units,
        revenue: Math.round(priceForSize(bean.price, size) * units * 100) / 100,
        channel,
        size,
      });
    }
  }
  return sales;
}

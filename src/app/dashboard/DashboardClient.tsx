"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { X } from "lucide-react";
import { getSales, type Sale } from "@/lib/sales-data";
import { products, type RoastLevel } from "@/lib/products";
import { getBeanStory } from "@/lib/bean-stories";
import { zar } from "@/lib/format";

type Period = "30d" | "90d" | "12m";
type Selection =
  | { kind: "bean"; slug: string }
  | { kind: "day"; weekday: number }
  | { kind: "hour"; hour: number }
  | { kind: "cell"; weekday: number; hour: number }
  | null;

const RED = "#c9a05a";
const DARK = "#000000";
const MUTED = "#dcdcdc";
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
const PERIOD_DAYS: Record<Period, number> = { "30d": 30, "90d": 90, "12m": 365 };
const ROAST_COLORS: Record<RoastLevel, string> = {
  Light: "#e8a45a",
  Medium: "#b5622d",
  Dark: "#3a1f14",
};

const beanBySlug = Object.fromEntries(products.map((p) => [p.slug, p]));

function money(n: number) {
  return zar(Math.round(n), 0);
}
function hourLabel(h: number) {
  return `${String(h).padStart(2, "0")}:00`;
}
function totals(list: Sale[]) {
  const revenue = list.reduce((s, x) => s + x.revenue, 0);
  const units = list.reduce((s, x) => s + x.units, 0);
  return { revenue, units, orders: list.length, aov: list.length ? revenue / list.length : 0 };
}
function pct(now: number, before: number) {
  if (!before) return null;
  return ((now - before) / before) * 100;
}
function addDays(iso: string, delta: number) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}
function argMax(map: Map<number, number>): number | null {
  let best: number | null = null;
  let bestVal = -1;
  map.forEach((v, k) => {
    if (v > bestVal) {
      bestVal = v;
      best = k;
    }
  });
  return best;
}
function readDatum<T>(data: unknown, key: string): T | undefined {
  const d = data as Record<string, unknown> & { payload?: Record<string, unknown> };
  return (d?.payload?.[key] ?? d?.[key]) as T | undefined;
}

export default function DashboardClient() {
  const allSales = useMemo(() => getSales(), []);
  const latest = useMemo(
    () => allSales.reduce((m, s) => (s.date > m ? s.date : m), allSales[0]?.date ?? ""),
    [allSales]
  );

  const [period, setPeriod] = useState<Period>("90d");
  const [roast, setRoast] = useState<"All" | RoastLevel>("All");
  const [channel, setChannel] = useState<"All" | "In-store" | "Online">("All");
  const [selection, setSelection] = useState<Selection>(null);

  const { base, previous } = useMemo(() => {
    const days = PERIOD_DAYS[period];
    const start = addDays(latest, -(days - 1));
    const prevStart = addDays(start, -days);
    const filtered = allSales.filter(
      (s) =>
        (roast === "All" || beanBySlug[s.beanSlug]?.roast === roast) &&
        (channel === "All" || s.channel === channel)
    );
    return {
      base: filtered.filter((s) => s.date >= start && s.date <= latest),
      previous: filtered.filter((s) => s.date >= prevStart && s.date < start),
    };
  }, [allSales, latest, period, roast, channel]);

  const slice = useMemo(() => {
    if (!selection) return base;
    return base.filter((s) => {
      if (selection.kind === "bean") return s.beanSlug === selection.slug;
      if (selection.kind === "day") return s.weekday === selection.weekday;
      if (selection.kind === "hour") return s.hour === selection.hour;
      return s.weekday === selection.weekday && s.hour === selection.hour;
    });
  }, [base, selection]);

  const kpi = useMemo(() => totals(base), [base]);
  const prevKpi = useMemo(() => totals(previous), [previous]);

  const byHour = useMemo(() => {
    const m = new Map<number, number>();
    base.forEach((s) => m.set(s.hour, (m.get(s.hour) ?? 0) + 1));
    return HOURS.map((h) => ({ hour: h, label: hourLabel(h), orders: m.get(h) ?? 0 }));
  }, [base]);

  const byDay = useMemo(() => {
    const m = new Map<number, number>();
    base.forEach((s) => m.set(s.weekday, (m.get(s.weekday) ?? 0) + s.revenue));
    return DAY_ORDER.map((d) => ({ weekday: d, label: DAY_SHORT[d], revenue: Math.round(m.get(d) ?? 0) }));
  }, [base]);

  const heat = useMemo(() => {
    const m = new Map<string, number>();
    let max = 0;
    base.forEach((s) => {
      const k = `${s.weekday}-${s.hour}`;
      const v = (m.get(k) ?? 0) + 1;
      m.set(k, v);
      if (v > max) max = v;
    });
    return { m, max };
  }, [base]);

  const topBeans = useMemo(() => {
    const m = new Map<string, { revenue: number; units: number }>();
    base.forEach((s) => {
      const cur = m.get(s.beanSlug) ?? { revenue: 0, units: 0 };
      cur.revenue += s.revenue;
      cur.units += s.units;
      m.set(s.beanSlug, cur);
    });
    return Array.from(m.entries())
      .map(([slug, v]) => ({
        slug,
        name: beanBySlug[slug]?.name ?? slug,
        roast: beanBySlug[slug]?.roast as RoastLevel,
        revenue: Math.round(v.revenue),
        units: v.units,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [base]);

  const trend = useMemo(() => {
    const m = new Map<string, number>();
    const keyOf = (iso: string) => {
      if (period === "30d") return iso;
      if (period === "90d") {
        const d = new Date(`${iso}T00:00:00`);
        d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
        return d.toISOString().slice(0, 10);
      }
      return iso.slice(0, 7);
    };
    base.forEach((s) => m.set(keyOf(s.date), (m.get(keyOf(s.date)) ?? 0) + s.revenue));
    return Array.from(m.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, revenue]) => {
        const d = new Date(period === "12m" ? `${key}-01T00:00:00` : `${key}T00:00:00`);
        const label =
          period === "12m"
            ? d.toLocaleDateString("en-GB", { month: "short" })
            : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
        return { key, label, revenue: Math.round(revenue) };
      });
  }, [base, period]);

  const roastSplit = useMemo(() => {
    const m = new Map<RoastLevel, number>();
    base.forEach((s) => {
      const r = beanBySlug[s.beanSlug]?.roast as RoastLevel;
      m.set(r, (m.get(r) ?? 0) + s.revenue);
    });
    return (["Light", "Medium", "Dark"] as RoastLevel[]).map((r) => ({
      name: r,
      value: Math.round(m.get(r) ?? 0),
    }));
  }, [base]);

  const peakHour = useMemo(() => argMax(new Map(byHour.map((h) => [h.hour, h.orders]))), [byHour]);
  const peakDay = useMemo(() => argMax(new Map(byDay.map((d) => [d.weekday, d.revenue]))), [byDay]);
  const best = topBeans[0];

  const selectionTitle = useMemo(() => {
    if (!selection) return "All sales in this view";
    if (selection.kind === "bean") return beanBySlug[selection.slug]?.name ?? "Bean";
    if (selection.kind === "day") return `${DAY_NAMES[selection.weekday]}s`;
    if (selection.kind === "hour") return `Around ${hourLabel(selection.hour)}`;
    return `${DAY_NAMES[selection.weekday]}s at ${hourLabel(selection.hour)}`;
  }, [selection]);

  const sliceKpi = useMemo(() => totals(slice), [slice]);
  const sliceHours = useMemo(() => {
    const m = new Map<number, number>();
    slice.forEach((s) => m.set(s.hour, (m.get(s.hour) ?? 0) + 1));
    return HOURS.map((h) => ({ label: hourLabel(h), orders: m.get(h) ?? 0, hour: h }));
  }, [slice]);
  const sliceDays = useMemo(() => {
    const m = new Map<number, number>();
    slice.forEach((s) => m.set(s.weekday, (m.get(s.weekday) ?? 0) + 1));
    return DAY_ORDER.map((d) => ({ label: DAY_SHORT[d], orders: m.get(d) ?? 0, weekday: d }));
  }, [slice]);
  const sliceBeans = useMemo(() => {
    const m = new Map<string, number>();
    slice.forEach((s) => m.set(s.beanSlug, (m.get(s.beanSlug) ?? 0) + s.revenue));
    return Array.from(m.entries())
      .map(([slug, revenue]) => ({ slug, name: beanBySlug[slug]?.name ?? slug, revenue: Math.round(revenue) }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [slice]);
  const slicePeakHour = argMax(new Map(sliceHours.map((h) => [h.hour, h.orders])));
  const slicePeakDay = argMax(new Map(sliceDays.map((d) => [d.weekday, d.orders])));
  const selectedStory = selection?.kind === "bean" ? getBeanStory(selection.slug) : undefined;

  function toggle(next: Selection) {
    setSelection((cur) => (JSON.stringify(cur) === JSON.stringify(next) ? null : next));
  }

  const kpis = [
    { label: "Revenue", value: money(kpi.revenue), delta: pct(kpi.revenue, prevKpi.revenue) },
    { label: "Bags sold", value: kpi.units.toLocaleString("en-US"), delta: pct(kpi.units, prevKpi.units) },
    { label: "Orders", value: kpi.orders.toLocaleString("en-US"), delta: pct(kpi.orders, prevKpi.orders) },
    { label: "Avg order value", value: zar(kpi.aov), delta: pct(kpi.aov, prevKpi.aov) },
  ];

  return (
    <div className="bg-cream-soft">
      <section className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            Coffee insights
          </p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">What&rsquo;s brewing, and when</h1>
          <p className="mt-3 max-w-xl font-body text-sm leading-6 text-white/85">
            Track which beans are flying off the shelf, and which day and hour
            our customers reach for them. Click any chart to dig deeper.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <Segmented
            label="Period"
            value={period}
            onChange={(v) => setPeriod(v as Period)}
            options={[
              { value: "30d", label: "30 days" },
              { value: "90d", label: "90 days" },
              { value: "12m", label: "12 months" },
            ]}
          />
          <Segmented
            label="Roast"
            value={roast}
            onChange={(v) => {
              setRoast(v as "All" | RoastLevel);
              setSelection(null);
            }}
            options={["All", "Light", "Medium", "Dark"].map((v) => ({ value: v, label: v }))}
          />
          <Segmented
            label="Channel"
            value={channel}
            onChange={(v) => setChannel(v as "All" | "In-store" | "Online")}
            options={["All", "In-store", "Online"].map((v) => ({ value: v, label: v }))}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="font-body text-xs font-medium uppercase tracking-[0.12em] text-espresso/50">
                {k.label}
              </p>
              <p className="mt-2 font-display text-3xl text-espresso">{k.value}</p>
              <p
                className={`mt-1 font-body text-xs ${
                  k.delta === null ? "text-espresso/40" : k.delta >= 0 ? "text-sage" : "text-caramel"
                }`}
              >
                {k.delta === null
                  ? "No earlier data"
                  : `${k.delta >= 0 ? "▲" : "▼"} ${Math.abs(k.delta).toFixed(1)}% vs previous period`}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <InsightCard
            title="Peak day"
            value={peakDay === null ? "—" : DAY_NAMES[peakDay]}
            note="Highest revenue day of the week"
            onClick={peakDay === null ? undefined : () => toggle({ kind: "day", weekday: peakDay })}
          />
          <InsightCard
            title="Peak time"
            value={peakHour === null ? "—" : hourLabel(peakHour)}
            note="Busiest hour for orders"
            onClick={peakHour === null ? undefined : () => toggle({ kind: "hour", hour: peakHour })}
          />
          <InsightCard
            title="Best seller"
            value={best?.name ?? "—"}
            note={best ? `${money(best.revenue)} · ${best.units} bags` : ""}
            onClick={best ? () => toggle({ kind: "bean", slug: best.slug }) : undefined}
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Card title="Sales trend" hint={period === "12m" ? "Revenue by month" : period === "90d" ? "Revenue by week" : "Revenue by day"} className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trend} margin={{ left: -10, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={RED} stopOpacity={0.35} />
                    <stop offset="1" stopColor={RED} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#eee5db" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={24} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `R${v}`} />
                <Tooltip formatter={(v) => [money(Number(v)), "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke={RED} strokeWidth={2.5} fill="url(#trendFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Roast mix" hint="Share of revenue">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={roastSplit} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {roastSplit.map((r) => (
                    <Cell key={r.name} fill={ROAST_COLORS[r.name]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => money(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 font-body text-xs text-espresso/70">
              {roastSplit.map((r) => (
                <span key={r.name} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: ROAST_COLORS[r.name] }} />
                  {r.name}
                </span>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card title="Busiest hours" hint="Orders by hour · click a bar">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={byHour} margin={{ left: -20, right: 4 }}>
                <CartesianGrid stroke="#eee5db" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v) => [v, "Orders"]} />
                <Bar
                  dataKey="orders"
                  radius={[6, 6, 0, 0]}
                  cursor="pointer"
                  onClick={(d) => {
                    const hour = readDatum<number>(d, "hour");
                    if (hour !== undefined) toggle({ kind: "hour", hour });
                  }}
                >
                  {byHour.map((h) => (
                    <Cell
                      key={h.hour}
                      fill={selection?.kind === "hour" && selection.hour === h.hour ? DARK : h.hour === peakHour ? RED : MUTED}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Busiest days" hint="Revenue by weekday · click a bar">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={byDay} margin={{ left: -10, right: 4 }}>
                <CartesianGrid stroke="#eee5db" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `R${v}`} />
                <Tooltip formatter={(v) => [money(Number(v)), "Revenue"]} />
                <Bar
                  dataKey="revenue"
                  radius={[6, 6, 0, 0]}
                  cursor="pointer"
                  onClick={(d) => {
                    const weekday = readDatum<number>(d, "weekday");
                    if (weekday !== undefined) toggle({ kind: "day", weekday });
                  }}
                >
                  {byDay.map((d) => (
                    <Cell
                      key={d.weekday}
                      fill={selection?.kind === "day" && selection.weekday === d.weekday ? DARK : d.weekday === peakDay ? RED : MUTED}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card title="Peak-time heatmap" hint="Orders by day and hour · click a cell">
            <div className="overflow-x-auto">
              <div className="min-w-[420px]">
                <div className="grid grid-cols-[44px_repeat(11,1fr)] gap-1 font-body text-[10px] text-espresso/50">
                  <span />
                  {HOURS.map((h) => (
                    <span key={h} className="text-center">
                      {h}
                    </span>
                  ))}
                  {DAY_ORDER.map((d) => (
                    <HeatRow
                      key={d}
                      weekday={d}
                      heat={heat}
                      selection={selection}
                      onSelect={(hour) => toggle({ kind: "cell", weekday: d, hour })}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Best-selling beans" hint="Revenue · click a bar to see its story and patterns">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topBeans} layout="vertical" margin={{ left: 40, right: 12 }}>
                <CartesianGrid stroke="#eee5db" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `R${v}`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={120} />
                <Tooltip formatter={(v) => [money(Number(v)), "Revenue"]} />
                <Bar
                  dataKey="revenue"
                  radius={[0, 6, 6, 0]}
                  cursor="pointer"
                  onClick={(d) => {
                    const slug = readDatum<string>(d, "slug");
                    if (slug) toggle({ kind: "bean", slug });
                  }}
                >
                  {topBeans.map((b) => (
                    <Cell
                      key={b.slug}
                      fill={selection?.kind === "bean" && selection.slug === b.slug ? DARK : ROAST_COLORS[b.roast] ?? RED}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <section className="mt-6 rounded-3xl border-2 border-caramel/20 bg-white p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-caramel">
                {selection ? "Drill-down" : "Overview"}
              </p>
              <h2 className="mt-1 font-display text-2xl text-espresso">{selectionTitle}</h2>
            </div>
            {selection && (
              <button
                onClick={() => setSelection(null)}
                className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-body text-xs text-espresso/70 hover:border-caramel"
              >
                <X size={13} /> Clear selection
              </button>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Mini label="Revenue" value={money(sliceKpi.revenue)} />
            <Mini label="Bags sold" value={sliceKpi.units.toLocaleString("en-US")} />
            <Mini label="Orders" value={sliceKpi.orders.toLocaleString("en-US")} />
            <Mini label="Avg order" value={zar(sliceKpi.aov)} />
          </div>

          <p className="mt-5 font-body text-sm leading-6 text-espresso/75">
            {sliceKpi.orders === 0
              ? "No sales match this selection with the current filters."
              : `${selectionTitle === "All sales in this view" ? "Overall" : selectionTitle} sells most on ${
                  slicePeakDay === null ? "—" : DAY_NAMES[slicePeakDay]
                }s, with the busiest hour around ${slicePeakHour === null ? "—" : hourLabel(slicePeakHour)}. ${
                  sliceBeans[0] ? `${sliceBeans[0].name} leads with ${money(sliceBeans[0].revenue)}.` : ""
                }`}
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div>
              <p className="mb-2 font-body text-xs uppercase tracking-[0.12em] text-espresso/50">By hour</p>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={sliceHours} margin={{ left: -30, right: 0 }}>
                  <XAxis dataKey="label" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval={1} />
                  <YAxis hide />
                  <Tooltip formatter={(v) => [v, "Orders"]} />
                  <Bar dataKey="orders" fill={RED} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="mb-2 font-body text-xs uppercase tracking-[0.12em] text-espresso/50">By weekday</p>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={sliceDays} margin={{ left: -30, right: 0 }}>
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip formatter={(v) => [v, "Orders"]} />
                  <Bar dataKey="orders" fill={DARK} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="mb-2 font-body text-xs uppercase tracking-[0.12em] text-espresso/50">
                {selection?.kind === "bean" ? "The story" : "Top beans here"}
              </p>
              {selection?.kind === "bean" && selectedStory ? (
                <div className="font-body text-sm text-espresso/75">
                  <p className="font-medium text-espresso">{selectedStory.headline}</p>
                  <p className="mt-1 text-xs text-espresso/50">
                    {selectedStory.farmer} · {selectedStory.farm}
                  </p>
                  <p className="mt-2 leading-6">{selectedStory.story[0]}</p>
                  <Link
                    href={`/shop/${selection.slug}`}
                    className="mt-3 inline-block font-medium text-caramel underline underline-offset-4"
                  >
                    Read the full story
                  </Link>
                </div>
              ) : (
                <ol className="flex flex-col gap-2">
                  {sliceBeans.map((b, i) => (
                    <li key={b.slug}>
                      <button
                        onClick={() => toggle({ kind: "bean", slug: b.slug })}
                        className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left font-body text-sm text-espresso hover:bg-beige"
                      >
                        <span>
                          <span className="mr-2 text-espresso/40">{i + 1}</span>
                          {b.name}
                        </span>
                        <span className="text-espresso/60">{money(b.revenue)}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </section>

        <p className="mt-6 font-body text-xs text-espresso/45">
          Figures are generated demo data for the last 12 months, ending {latest}. Swap in your own sales in{" "}
          <code>src/lib/sales-data.ts</code>.
        </p>
      </div>
    </div>
  );
}

function Segmented({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-body text-xs text-espresso/50">{label}</span>
      <div className="flex rounded-full bg-white p-1 shadow-sm">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`rounded-full px-3 py-1.5 font-body text-xs font-medium transition-colors ${
              value === o.value ? "bg-caramel text-white" : "text-espresso/70 hover:text-espresso"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Card({
  title,
  hint,
  children,
  className = "",
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-3">
        <h3 className="font-display text-base text-espresso">{title}</h3>
        {hint && <p className="font-body text-xs text-espresso/50">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function InsightCard({
  title,
  value,
  note,
  onClick,
}: {
  title: string;
  value: string;
  note: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border-2 border-transparent bg-white p-5 text-left shadow-sm transition-colors hover:border-caramel"
    >
      <p className="font-body text-xs font-semibold uppercase tracking-[0.12em] text-caramel">{title}</p>
      <p className="mt-2 font-display text-2xl text-espresso">{value}</p>
      <p className="mt-1 font-body text-xs text-espresso/55">{note}</p>
    </button>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-cream-soft p-4">
      <p className="font-body text-xs text-espresso/50">{label}</p>
      <p className="mt-1 font-display text-xl text-espresso">{value}</p>
    </div>
  );
}

function HeatRow({
  weekday,
  heat,
  selection,
  onSelect,
}: {
  weekday: number;
  heat: { m: Map<string, number>; max: number };
  selection: Selection;
  onSelect: (hour: number) => void;
}) {
  return (
    <>
      <span className="self-center pr-1 text-right">{DAY_SHORT[weekday]}</span>
      {HOURS.map((h) => {
        const v = heat.m.get(`${weekday}-${h}`) ?? 0;
        const alpha = heat.max ? 0.08 + (v / heat.max) * 0.92 : 0.08;
        const active = selection?.kind === "cell" && selection.weekday === weekday && selection.hour === h;
        return (
          <button
            key={h}
            onClick={() => onSelect(h)}
            title={`${DAY_NAMES[weekday]} ${hourLabel(h)} — ${v} orders`}
            aria-label={`${DAY_NAMES[weekday]} ${hourLabel(h)}, ${v} orders`}
            className={`aspect-square rounded-md transition-transform hover:scale-110 ${active ? "ring-2 ring-espresso" : ""}`}
            style={{ background: `rgba(184, 137, 60, ${alpha})` }}
          />
        );
      })}
    </>
  );
}

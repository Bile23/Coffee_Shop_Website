export type RoastLevel = "Light" | "Medium" | "Dark";
export type GrindOption = "Whole Bean" | "Espresso" | "Filter" | "French Press";
export type FlavorProfile =
  | "Fruity"
  | "Chocolatey"
  | "Nutty"
  | "Caramel"
  | "Bold";

export type Size = "250g" | "500g" | "1kg";

export const SIZE_MULTIPLIER: Record<Size, number> = {
  "250g": 1,
  "500g": 1.85,
  "1kg": 3.4,
};

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
}

export interface Product {
  slug: string;
  name: string;
  origin: string;
  region: string;
  altitude: string;
  process: string;
  roast: RoastLevel;
  flavors: FlavorProfile[];
  tastingNotes: string;
  description: string;
  price: number; // price for 250g, in ZAR
  rating: number;
  reviewCount: number;
  bestSeller: boolean;
  seasonal: boolean;
  isNew: boolean;
  createdAt: string;
  images: string[]; // first image is the bag photo used on cards and the product page
  recommendedBrewMethods: string[];
  reviews: Review[];
}

// The range shot showing five of the bags together (used as a banner).
export const RANGE_IMAGE = "/images/bags/range.jpg";

export const products: Product[] = [
  {
    slug: "house-blend",
    name: "House Blend",
    origin: "Signature Blend",
    region: "Partner farms across Africa",
    altitude: "1,500–1,900m",
    process: "Washed",
    roast: "Medium",
    flavors: ["Chocolatey", "Caramel", "Nutty"],
    tastingNotes: "Chocolate, caramel, nutty",
    description:
      "Our signature blend: a smooth, balanced cup inspired by people, places and bolder tomorrows. Built to taste good at 7am, with milk or without, on a scale from lazy Sunday to double shift.",
    price: 165,
    rating: 4.8,
    reviewCount: 212,
    bestSeller: true,
    seasonal: false,
    isNew: false,
    createdAt: "2025-08-11",
    images: ["/images/bags/house-blend.jpg"],
    recommendedBrewMethods: ["Espresso", "Filter", "French Press"],
    reviews: [
      {
        id: "r1",
        author: "Naledi K.",
        rating: 5,
        date: "2026-08-02",
        title: "The one I keep coming back to",
        body: "Chocolatey without being heavy. It's what our whole office drinks now.",
      },
      {
        id: "r2",
        author: "Marcus T.",
        rating: 5,
        date: "2026-07-20",
        title: "Consistent every time",
        body: "Ordered four bags now, every one tastes the same. That's exactly what you want from a house blend.",
      },
    ],
  },
  {
    slug: "dark-roast",
    name: "Dark Roast",
    origin: "Rwanda",
    region: "Nyamasheke",
    altitude: "1,700m",
    process: "Washed",
    roast: "Dark",
    flavors: ["Bold", "Chocolatey"],
    tastingNotes: "Dark chocolate, spice, full-bodied",
    description:
      "Bold, smooth and rich. Deep flavours for brighter tomorrows. A single-origin dark roast that keeps its sweetness instead of turning ashy, so it stands up to milk and to a heavy hand on the espresso machine.",
    price: 175,
    rating: 4.7,
    reviewCount: 148,
    bestSeller: true,
    seasonal: false,
    isNew: false,
    createdAt: "2025-09-18",
    images: ["/images/bags/dark-roast.jpg"],
    recommendedBrewMethods: ["Espresso", "Moka Pot", "French Press"],
    reviews: [
      {
        id: "r3",
        author: "Diego R.",
        rating: 5,
        date: "2026-06-12",
        title: "Dark, but not bitter",
        body: "Finally a dark roast that still tastes like coffee and not charcoal. Great in the moka pot.",
      },
    ],
  },
  {
    slug: "brazil-santos",
    name: "Brazil Santos",
    origin: "Brazil",
    region: "Santos",
    altitude: "1,100m",
    process: "Natural",
    roast: "Medium",
    flavors: ["Caramel", "Nutty"],
    tastingNotes: "Caramel, nutty, smooth",
    description:
      "Sun-kissed beans, a naturally brighter cup. Grown near the port of Santos and dried whole in the sun, this is the easy-drinking coffee that turns skeptics into regulars.",
    price: 175,
    rating: 4.6,
    reviewCount: 96,
    bestSeller: true,
    seasonal: false,
    isNew: false,
    createdAt: "2025-10-05",
    images: ["/images/bags/brazil-santos.jpg"],
    recommendedBrewMethods: ["Espresso", "Filter", "French Press"],
    reviews: [
      {
        id: "r4",
        author: "Priya S.",
        rating: 4,
        date: "2026-05-11",
        title: "Smooth and sweet",
        body: "Caramel all the way through. Lovely as a flat white.",
      },
    ],
  },
  {
    slug: "kenya-aa",
    name: "Kenya AA",
    origin: "Kenya",
    region: "Mt. Kenya",
    altitude: "1,900m",
    process: "Washed",
    roast: "Light",
    flavors: ["Fruity", "Bold"],
    tastingNotes: "Berry, citrus, vibrant",
    description:
      "Bright flavours from high-altitude beans. The AA grade means the largest, densest beans on the mountain, roasted light so the blackcurrant and citrus stay loud and clear.",
    price: 215,
    rating: 4.9,
    reviewCount: 88,
    bestSeller: true,
    seasonal: false,
    isNew: false,
    createdAt: "2026-01-14",
    images: ["/images/bags/kenya-aa.jpg"],
    recommendedBrewMethods: ["Pour Over", "AeroPress", "Filter"],
    reviews: [
      {
        id: "r5",
        author: "Ella M.",
        rating: 5,
        date: "2026-08-30",
        title: "Berries in a cup",
        body: "Brewed as a pour over it's juicy and clean. My favourite of the range.",
      },
    ],
  },
  {
    slug: "kenya-nyeri",
    name: "Kenya Nyeri",
    origin: "Kenya",
    region: "Nyeri",
    altitude: "1,800m",
    process: "Washed",
    roast: "Light",
    flavors: ["Fruity"],
    tastingNotes: "Berry, floral, vibrant",
    description:
      "Bright flavours, brighter tomorrows. A lighter, more floral Kenyan from the hills around Nyeri, with jasmine on the nose and red berries in the finish.",
    price: 205,
    rating: 4.8,
    reviewCount: 54,
    bestSeller: false,
    seasonal: true,
    isNew: true,
    createdAt: "2026-08-30",
    images: ["/images/bags/kenya-nyeri.jpg"],
    recommendedBrewMethods: ["Pour Over", "AeroPress"],
    reviews: [],
  },
  {
    slug: "arabic-blend",
    name: "Arabic Blend",
    origin: "Signature Blend",
    region: "Partner roasters, East Africa & Yemen",
    altitude: "1,600m",
    process: "Natural",
    roast: "Medium",
    flavors: ["Bold", "Chocolatey"],
    tastingNotes: "Rich, balanced, distinctive",
    description:
      "A premium Arabic-style blend for the ritual of sharing a cup. Rich and balanced with a distinctive character, made for slow afternoons, long conversations and pouring for guests.",
    price: 195,
    rating: 4.7,
    reviewCount: 41,
    bestSeller: false,
    seasonal: false,
    isNew: true,
    createdAt: "2026-09-02",
    images: ["/images/bags/arabic-blend.jpg"],
    recommendedBrewMethods: ["Moka Pot", "French Press"],
    reviews: [],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, count = 4): Product[] {
  return products
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => {
      const aScore = a.flavors.filter((f) => product.flavors.includes(f)).length;
      const bScore = b.flavors.filter((f) => product.flavors.includes(f)).length;
      return bScore - aScore;
    })
    .slice(0, count);
}

export function priceForSize(basePrice: number, size: Size): number {
  return Math.round(basePrice * SIZE_MULTIPLIER[size] * 100) / 100;
}

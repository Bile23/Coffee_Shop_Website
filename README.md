# Coffee_Shop_Website
A premium specialty coffee storefront and analytics dashboard, built as a portfolio project. The look is black, white and gold, inspired by upscale roasters, with real branded packaging photography and prices in South African rand (ZAR).

Features
Animated intro: a coffee bean falls into a cup, ripples and splashes, then the hero video opens out from the cup and plays on its own.
Shop: six coffee bags with filters (roast, origin, flavour, price), search and sorting, plus product pages with size, grind and quantity options.
Working cart: a slide-out mini cart, a full cart page, discount codes, a delivery-fee calculation, and a multi-step checkout with an order confirmation. The cart is saved in local storage. Payment is a placeholder, with no real gateway connected.
Bean stories: every bag has a fictional farmer, a farm and a story, shown on a dedicated Our Beans page and on each product page.
Coffee Insights dashboard: KPIs, sales trends, peak days and hours, a day-by-hour heatmap, roast mix and best sellers. Click any chart to drill into that slice. It runs on generated demo data with a single swap point, getSales() in src/lib/sales-data.ts, for a real dataset.
Responsive and accessible: a slide-out menu, alt text on images and reduced-motion support.
Tech stack
Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide icons.

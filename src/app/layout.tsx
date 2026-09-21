import type { Metadata } from "next";
import { Archivo, Cinzel } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MiniCart from "@/components/MiniCart";
import BackToTop from "@/components/BackToTop";
import { FREE_DELIVERY_THRESHOLD, zar } from "@/lib/format";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Coffee with Thabi — Every cup has a story",
  description:
    "Small-batch coffee beans, each with a story. Shop the range and explore what's brewing in our coffee insights dashboard.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${cinzel.variable}`}>
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <div className="bg-black px-4 py-2.5 text-center font-body text-xs font-semibold text-white/85">
            Free delivery on orders over {zar(FREE_DELIVERY_THRESHOLD, 0)}
          </div>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
          <MiniCart />
          <BackToTop />
        </CartProvider>
      </body>
    </html>
  );
}

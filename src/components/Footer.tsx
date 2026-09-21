import Link from "next/link";
import { InstagramIcon, FacebookIcon, TwitterIcon } from "./SocialIcons";

export default function Footer() {
  return (
    <footer>
      <div className="bg-black text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:px-8 md:grid-cols-3">
          <div>
            <p className="font-display text-lg font-semibold">Shop</p>
            <ul className="mt-5 flex flex-col gap-3 font-body text-sm text-white/80">
              <li><Link href="/shop" className="hover:text-caramel">All Coffee</Link></li>
              <li><Link href="/shop?roast=Light" className="hover:text-caramel">Light Roast</Link></li>
              <li><Link href="/shop?roast=Medium" className="hover:text-caramel">Medium Roast</Link></li>
              <li><Link href="/shop?roast=Dark" className="hover:text-caramel">Dark Roast</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-display text-lg font-semibold">Explore</p>
            <ul className="mt-5 flex flex-col gap-3 font-body text-sm text-white/80">
              <li><Link href="/beans" className="hover:text-caramel">Our Beans</Link></li>
              <li><Link href="/dashboard" className="hover:text-caramel">Coffee Insights</Link></li>
              <li><Link href="/cart" className="hover:text-caramel">Cart</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-display text-lg font-semibold">Visit</p>
            <ul className="mt-5 flex flex-col gap-3 font-body text-sm text-white/80">
              <li>4 Foundry Lane</li>
              <li>Mon–Sat, 7am–5pm</li>
              <li>hello@coffeewiththabi.co.za</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center gap-8 pb-12 text-white">
          <a href="#" aria-label="Instagram" className="hover:text-caramel">
            <InstagramIcon size={34} />
          </a>
          <a href="#" aria-label="Facebook" className="hover:text-caramel">
            <FacebookIcon size={34} />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-caramel">
            <TwitterIcon size={34} />
          </a>
        </div>
      </div>
      <div className="bg-[#f2f2f2] px-6 py-5 text-center font-body text-xs text-black/60">
        © 2026 Coffee with Thabi. People · Places · Better coffee.
      </div>
    </footer>
  );
}

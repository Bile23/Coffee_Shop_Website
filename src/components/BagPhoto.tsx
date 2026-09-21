import Image from "next/image";
import { getProductBySlug } from "@/lib/products";

// Renders the real bag photo for a product. Fills its parent, so the parent controls size and aspect ratio.
export default function BagPhoto({
  slug,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority = false,
  className = "",
}: {
  slug: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const product = getProductBySlug(slug);
  if (!product) return <div className={`h-full w-full bg-beige ${className}`} />;

  return (
    <div className={`relative h-full w-full ${className}`}>
      <Image
        src={product.images[0]}
        alt={`${product.name} coffee bag, ${product.roast.toLowerCase()} roast, 250g`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}

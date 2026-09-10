import Image from "next/image";
import { getCategoryCollage } from "@/data/products";

type CategoryCollageProps = {
  slug: string;
  fallback: string;
  fallbackAlt: string;
  className?: string;
  sizes?: string;
};

export default function CategoryCollage({
  slug,
  fallback,
  fallbackAlt,
  className = "",
  sizes = "(max-width: 1024px) 72vw, 18.5rem",
}: CategoryCollageProps) {
  const collage = getCategoryCollage(slug);

  if (collage.images.length < 2) {
    return (
      <Image
        src={fallback}
        alt={fallbackAlt}
        fill
        className={`object-cover ${className}`}
        sizes={sizes}
      />
    );
  }

  const cells = collage.images.slice(0, 4);

  return (
    <div className={`absolute inset-0 grid grid-cols-2 grid-rows-2 ${className}`}>
      {cells.map((cell, index) => (
        <div key={`${cell.src}-${index}`} className="relative overflow-hidden">
          <Image
            src={cell.src}
            alt={cell.alt}
            fill
            className="object-cover"
            sizes={sizes}
          />
        </div>
      ))}
      {collage.brands.length > 0 ? (
        <ul className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-wrap gap-1 bg-gradient-to-t from-brand-dark/80 to-transparent p-2">
          {collage.brands.slice(0, 3).map((brand) => (
            <li
              key={brand}
              className="rounded bg-white/95 px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-brand-dark uppercase"
            >
              {brand}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

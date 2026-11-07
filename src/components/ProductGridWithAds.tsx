import Link from "next/link";
import ProductCard from "./ProductCard";
import SmartImage from "./SmartImage";
import type { ProductCardData } from "@/lib/types";
import type { SquareAd } from "@/lib/data";

function AdTile({ ad }: { ad: SquareAd }) {
  const inner = (
    <div className="relative aspect-square h-full w-full overflow-hidden">
      <SmartImage
        src={ad.image}
        alt="Publicité"
        fill
        sizes="(max-width: 640px) 50vw, 20vw"
        className="object-cover transition-transform duration-500 hover:scale-105"
      />
      <span className="absolute left-2 top-2 rounded bg-black/40 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur">
        Pub
      </span>
    </div>
  );
  return (
    <div className="overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.06]">
      {ad.link ? (
        <Link href={ad.link} className="block h-full">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </div>
  );
}

/**
 * Grille produits avec bannières carrées insérées intelligemment
 * (une pub toutes les ~`interval` fiches, en cyclant les pubs).
 */
export default function ProductGridWithAds({
  products,
  ads = [],
  interval = 8,
}: {
  products: ProductCardData[];
  ads?: SquareAd[];
  interval?: number;
}) {
  const cells: React.ReactNode[] = [];
  let adIndex = 0;

  products.forEach((p, i) => {
    cells.push(<ProductCard key={p.id} product={p} index={i} />);
    const isSlot = (i + 1) % interval === 0;
    if (isSlot && ads.length > 0 && i < products.length - 1) {
      const ad = ads[adIndex % ads.length];
      adIndex += 1;
      cells.push(<AdTile key={`ad-${i}-${adIndex}`} ad={ad} />);
    }
  });

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {cells}
    </div>
  );
}

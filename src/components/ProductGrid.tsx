import ProductCard from "./ProductCard";
import type { ProductCardData } from "@/lib/types";

export default function ProductGrid({
  products,
}: {
  products: ProductCardData[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SmartImage from "./SmartImage";
import { CategoryIcon } from "./icons";
import type { CategoryData } from "@/lib/types";

export default function CategoriesShowcase({
  categories,
}: {
  categories: CategoryData[];
}) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <h2 className="section-title title-underline">Nos catégories</h2>
        <Link
          href="/boutique"
          className="group flex items-center gap-1 text-sm font-semibold text-zaya hover:text-zaya-600"
        >
          Voir toutes les catégories
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5 xl:grid-cols-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categorie/${cat.slug}`}
            className="group flex flex-col items-center gap-2 rounded-xl bg-white p-3 ring-1 ring-black/[0.06] transition hover:ring-zaya"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-neutral-50 ring-1 ring-black/5 sm:h-20 sm:w-20">
              {cat.image ? (
                <SmartImage
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="80px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-zaya">
                  <CategoryIcon name={cat.icon} className="h-7 w-7" />
                </span>
              )}
            </div>
            <span className="line-clamp-2 text-center text-xs font-medium text-ink group-hover:text-zaya sm:text-[13px]">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

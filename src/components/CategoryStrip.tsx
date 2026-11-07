import Link from "next/link";
import { CategoryIcon } from "./icons";
import type { CategoryData } from "@/lib/types";

export default function CategoryStrip({
  categories,
}: {
  categories: CategoryData[];
}) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-3 lg:grid-cols-11">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/categorie/${cat.slug}`}
          className="group flex flex-col items-center gap-2 rounded-2xl p-2 text-center transition-colors hover:bg-white"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-zaya shadow-card ring-1 ring-black/5 transition-transform group-hover:-translate-y-1 group-hover:text-zaya-600 sm:h-16 sm:w-16">
            <CategoryIcon name={cat.icon} className="h-6 w-6 sm:h-7 sm:w-7" />
          </span>
          <span className="line-clamp-2 text-[11px] font-medium leading-tight text-ink sm:text-xs">
            {cat.name}
          </span>
        </Link>
      ))}
    </div>
  );
}

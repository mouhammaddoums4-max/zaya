"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

const SORTS = [
  { value: "populaire", label: "Popularité" },
  { value: "nouveau", label: "Nouveautés" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
];

export default function BoutiqueToolbar({ count }: { count: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("tri") || "populaire";

  const onSort = (value: string) => {
    const next = new URLSearchParams(params.toString());
    next.set("tri", value);
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-ink-muted">
        <span className="font-semibold text-ink">{count}</span> produit
        {count > 1 ? "s" : ""}
      </p>
      <label className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm">
        <ArrowUpDown className="h-4 w-4 text-ink-muted" />
        <span className="hidden text-ink-muted sm:inline">Trier :</span>
        <select
          value={current}
          onChange={(e) => onSort(e.target.value)}
          className="bg-transparent font-medium text-ink outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

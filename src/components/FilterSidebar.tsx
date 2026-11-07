"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, RotateCcw } from "lucide-react";

const CONDITIONS = [
  { value: "", label: "Tous" },
  { value: "NEUF", label: "Neuf" },
  { value: "OCCASION", label: "Occasion" },
  { value: "RECONDITIONNE", label: "Reconditionné" },
];

const DISCOUNTS = [
  { value: "", label: "Toutes" },
  { value: "10", label: "10% ou plus" },
  { value: "25", label: "25% ou plus" },
  { value: "50", label: "50% ou plus" },
];

export default function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [min, setMin] = useState(params.get("min") || "");
  const [max, setMax] = useState(params.get("max") || "");

  const condition = params.get("condition") || "";
  const remise = params.get("remise") || "";
  const inStock = params.get("instock") === "1";

  const update = (next: Record<string, string | null>) => {
    const p = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v === null || v === "") p.delete(k);
      else p.set(k, v);
    }
    router.push(`${pathname}?${p.toString()}`);
  };

  const applyPrice = () => update({ min: min || null, max: max || null });

  const reset = () => {
    setMin("");
    setMax("");
    const p = new URLSearchParams(params.toString());
    ["min", "max", "condition", "remise", "instock"].forEach((k) => p.delete(k));
    router.push(`${pathname}?${p.toString()}`);
  };

  const Panel = (
    <div className="space-y-6">
      {/* Prix */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">Prix (FG)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            placeholder="Min"
            className="w-full rounded-lg border border-black/10 px-2.5 py-2 text-sm outline-none focus:border-zaya"
          />
          <span className="text-ink-muted">–</span>
          <input
            type="number"
            inputMode="numeric"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            placeholder="Max"
            className="w-full rounded-lg border border-black/10 px-2.5 py-2 text-sm outline-none focus:border-zaya"
          />
        </div>
        <button onClick={applyPrice} className="mt-2 w-full rounded-lg bg-ink py-2 text-xs font-semibold text-white">
          Appliquer
        </button>
      </div>

      {/* État */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">État</h3>
        <div className="space-y-1.5">
          {CONDITIONS.map((c) => (
            <label key={c.value} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="condition"
                checked={condition === c.value}
                onChange={() => update({ condition: c.value || null })}
                className="h-4 w-4 accent-zaya"
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      {/* Remise */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">Remise</h3>
        <div className="space-y-1.5">
          {DISCOUNTS.map((d) => (
            <label key={d.value} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="remise"
                checked={remise === d.value}
                onChange={() => update({ remise: d.value || null })}
                className="h-4 w-4 accent-zaya"
              />
              {d.label}
            </label>
          ))}
        </div>
      </div>

      {/* Stock */}
      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => update({ instock: e.target.checked ? "1" : null })}
          className="h-4 w-4 accent-zaya"
        />
        En stock uniquement
      </label>

      <button onClick={reset} className="flex items-center gap-1.5 text-sm font-medium text-zaya hover:text-zaya-600">
        <RotateCcw className="h-4 w-4" /> Réinitialiser les filtres
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="sticky top-24 rounded-xl bg-white p-5 ring-1 ring-black/[0.06]">
          <h2 className="mb-4 flex items-center gap-2 font-display font-bold">
            <SlidersHorizontal className="h-4 w-4 text-zaya" /> Filtres
          </h2>
          {Panel}
        </div>
      </aside>

      {/* Bouton mobile */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4 text-zaya" /> Filtres
      </button>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-xs overflow-y-auto bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display font-bold">
                <SlidersHorizontal className="h-4 w-4 text-zaya" /> Filtres
              </h2>
              <button onClick={() => setOpen(false)} aria-label="Fermer">
                <X className="h-5 w-5" />
              </button>
            </div>
            {Panel}
            <button onClick={() => setOpen(false)} className="btn-primary mt-6 w-full">
              Voir les résultats
            </button>
          </div>
        </div>
      )}
    </>
  );
}

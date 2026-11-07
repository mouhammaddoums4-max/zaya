"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useRecentlyViewed } from "@/store/recentlyViewed";
import ProductCard from "./ProductCard";

export default function RecentlyViewed({
  excludeId,
  title = "Vus récemment",
}: {
  excludeId?: string;
  title?: string;
}) {
  const items = useRecentlyViewed((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  const list = items.filter((p) => p.id !== excludeId).slice(0, 6);
  if (list.length < 2) return null;

  return (
    <section>
      <h2 className="section-title title-underline mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-zaya" />
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {list.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}

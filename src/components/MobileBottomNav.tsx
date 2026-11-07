"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, Phone } from "lucide-react";
import { useCart } from "@/store/cart";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const count = useCart((s) => s.count());
  const openCart = useCart((s) => s.open);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (pathname.startsWith("/admin")) return null;

  const items = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/boutique", label: "Boutique", icon: LayoutGrid },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-4">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                active ? "text-zaya" : "text-ink-muted",
              )}
            >
              <it.icon className="h-5 w-5" />
              {it.label}
            </Link>
          );
        })}
        <button
          onClick={openCart}
          className="relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-ink-muted"
        >
          <span className="relative">
            <ShoppingCart className="h-5 w-5" />
            {mounted && count > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-zaya px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </span>
          Panier
        </button>
        <a
          href={`https://wa.me/${SITE.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-ink-muted"
        >
          <Phone className="h-5 w-5" />
          Contact
        </a>
      </div>
    </nav>
  );
}

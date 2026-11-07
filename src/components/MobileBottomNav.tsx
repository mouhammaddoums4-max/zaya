"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const cartCount = useCart((s) => s.count());
  const openCart = useCart((s) => s.open);
  const wishCount = useWishlist((s) => s.count());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (pathname.startsWith("/admin")) return null;

  const links = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/boutique", label: "Boutique", icon: LayoutGrid },
    { href: "/favoris", label: "Favoris", icon: Heart, badge: wishCount },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-4">
        {links.map((it) => {
          const active = pathname === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                active ? "text-zaya" : "text-ink-muted",
              )}
            >
              <span className="relative">
                <it.icon className="h-5 w-5" />
                {mounted && it.badge ? (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-zaya px-1 text-[10px] font-bold text-white">
                    {it.badge}
                  </span>
                ) : null}
              </span>
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
            {mounted && cartCount > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-zaya px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </span>
          Panier
        </button>
      </div>
    </nav>
  );
}

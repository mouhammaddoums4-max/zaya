"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Home,
  Flame,
  Zap,
  Store,
  Info,
  Headphones,
  ShieldCheck,
  Truck,
  Phone,
} from "lucide-react";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { CategoryIcon } from "./icons";
import type { CategoryData } from "@/lib/types";
import { SITE } from "@/lib/constants";

const NAV = [
  { href: "/", label: "Accueil", icon: Home, exact: true },
  { href: "/boutique", label: "Boutique", icon: Store },
  { href: "/boutique?filtre=promo", label: "Promotions", icon: Flame },
  { href: "/boutique?filtre=flash", label: "Ventes Flash", icon: Zap },
  { href: "/a-propos", label: "À propos", icon: Info },
];

function formatPhone(w: string) {
  if (w.length < 9) return `+${w}`;
  return `+${w.slice(0, 3)} ${w.slice(3, 6)} ${w.slice(6, 9)} ${w.slice(9)}`;
}

export default function HeaderClient({
  categories,
}: {
  categories: CategoryData[];
}) {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filtre = searchParams.get("filtre");
  const cartCount = useCart((s) => s.count());
  const openCart = useCart((s) => s.open);
  const wishCount = useWishlist((s) => s.count());
  const catRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setMenuOpen(false);
    setCatOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node))
        setCatOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target as Node))
        setAccountOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/boutique?q=${encodeURIComponent(q)}` : "/boutique");
  };

  if (pathname.startsWith("/admin")) return null;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/boutique") return pathname === "/boutique" && !filtre;
    if (href === "/boutique?filtre=promo")
      return pathname.startsWith("/boutique") && filtre === "promo";
    if (href === "/boutique?filtre=flash")
      return pathname.startsWith("/boutique") && filtre === "flash";
    return pathname === href;
  };

  return (
    <>
      {/* Barre du haut */}
      <div className="hidden bg-ink text-white md:block">
        <div className="container-zaya flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-zaya-400" /> Achats sécurisés
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-zaya-400" /> Livraison partout en Guinée
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-zaya-400" />
              Service client : {formatPhone(SITE.whatsapp)}
            </span>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-colors hover:text-zaya-400"
            >
              Contact
            </a>
          </div>
        </div>
      </div>

      {/* En-tête principal */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white">
        <div className="container-zaya flex h-16 items-center gap-3 md:h-[72px] md:gap-6">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-black/5 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link href="/" className="flex shrink-0 items-center" aria-label="Accueil ZAYA">
            <Image
              src="/logo-zaya.png"
              alt="ZAYA"
              width={140}
              height={46}
              priority
              className="h-8 w-auto md:h-9"
            />
          </Link>

          {/* Recherche desktop */}
          <form onSubmit={submitSearch} className="hidden flex-1 md:block">
            <div className="flex items-center overflow-hidden rounded-lg border-2 border-zaya/80 bg-white">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Rechercher un produit, une marque..."
                className="w-full bg-transparent px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-muted"
              />
              <button
                type="submit"
                aria-label="Rechercher"
                className="flex h-11 w-14 items-center justify-center bg-zaya text-white transition hover:bg-zaya-600"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Actions droite */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {/* Compte */}
            <div ref={accountRef} className="relative hidden sm:block">
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-ink transition hover:bg-black/5"
              >
                <User className="h-5 w-5" />
                <span className="hidden text-sm font-medium lg:inline">Compte</span>
                <ChevronDown className="hidden h-4 w-4 lg:inline" />
              </button>
              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl bg-white py-2 shadow-xl ring-1 ring-black/5"
                  >
                    <Link href="/favoris" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-zaya-50">
                      <Heart className="h-4 w-4 text-zaya" /> Mes favoris
                    </Link>
                    <Link href="/panier" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-zaya-50">
                      <ShoppingCart className="h-4 w-4 text-zaya" /> Mon panier
                    </Link>
                    <Link href="/a-propos" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-zaya-50">
                      <Info className="h-4 w-4 text-zaya" /> À propos
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Favoris */}
            <Link
              href="/favoris"
              aria-label="Favoris"
              className="relative flex h-11 items-center gap-1.5 rounded-lg px-2 text-ink transition hover:bg-black/5"
            >
              <span className="relative">
                <Heart className="h-6 w-6" />
                {mounted && wishCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-zaya px-1 text-[11px] font-bold text-white">
                    {wishCount}
                  </span>
                )}
              </span>
              <span className="hidden text-sm font-medium lg:inline">Favoris</span>
            </Link>

            {/* Panier */}
            <button
              onClick={openCart}
              aria-label="Panier"
              className="relative flex h-11 items-center gap-1.5 rounded-lg px-2 text-ink transition hover:bg-black/5"
            >
              <span className="relative">
                <ShoppingCart className="h-6 w-6" />
                {mounted && cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-zaya px-1 text-[11px] font-bold text-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </span>
              <span className="hidden text-sm font-medium lg:inline">Panier</span>
            </button>
          </div>
        </div>

        {/* Recherche mobile */}
        <div className="container-zaya pb-3 md:hidden">
          <form onSubmit={submitSearch}>
            <div className="flex items-center overflow-hidden rounded-lg border-2 border-zaya/80 bg-white">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Rechercher sur ZAYA..."
                className="w-full bg-transparent px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-muted"
              />
              <button type="submit" aria-label="Rechercher" className="flex h-10 w-12 items-center justify-center bg-zaya text-white">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Barre de navigation (desktop) */}
        <div className="hidden border-t border-black/5 lg:block">
          <div className="container-zaya flex items-center gap-2">
            {/* Toutes les catégories */}
            <div ref={catRef} className="relative">
              <button
                onClick={() => setCatOpen((v) => !v)}
                className="my-2 flex items-center gap-2 rounded-lg bg-zaya px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zaya-600"
              >
                <Menu className="h-4 w-4" />
                Toutes les catégories
                <ChevronDown className={`h-4 w-4 transition ${catOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute left-0 top-full z-50 w-72 overflow-hidden rounded-xl bg-white py-2 shadow-xl ring-1 ring-black/5"
                  >
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categorie/${cat.slug}`}
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-ink transition hover:bg-zaya-50 hover:text-zaya"
                      >
                        <span className="flex items-center gap-3">
                          <CategoryIcon name={cat.icon} className="h-5 w-5 text-zaya" />
                          {cat.name}
                        </span>
                        <ChevronRight className="h-4 w-4 text-ink-muted" />
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Onglets */}
            <nav className="flex items-center">
              {NAV.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`relative flex items-center gap-1.5 px-3 py-3.5 text-sm font-medium transition-colors ${
                      active ? "text-zaya" : "text-ink hover:text-zaya"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    {active && (
                      <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-zaya" />
                    )}
                  </Link>
                );
              })}
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-3.5 text-sm font-medium text-ink transition-colors hover:text-zaya"
              >
                <Headphones className="h-4 w-4" />
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Drawer mobile */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[70] bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-[80] flex w-[86%] max-w-sm flex-col bg-white lg:hidden"
            >
              <div className="flex items-center justify-between bg-ink px-4 py-4">
                <Image src="/logo-zaya.png" alt="ZAYA" width={110} height={36} className="logo-white h-7 w-auto" />
                <button onClick={() => setMenuOpen(false)} aria-label="Fermer" className="flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-white/10">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="border-b border-black/5 p-2">
                  {NAV.map((item) => (
                    <Link key={item.label} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-ink hover:bg-zaya-50">
                      <item.icon className="h-5 w-5 text-zaya" /> {item.label}
                    </Link>
                  ))}
                </div>
                <p className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">Catégories</p>
                <div className="p-2">
                  {categories.map((cat) => (
                    <Link key={cat.id} href={`/categorie/${cat.slug}`} className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-ink hover:bg-zaya-50">
                      <span className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zaya-50 text-zaya">
                          <CategoryIcon name={cat.icon} className="h-5 w-5" />
                        </span>
                        {cat.name}
                      </span>
                      <ChevronRight className="h-4 w-4 text-ink-muted" />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

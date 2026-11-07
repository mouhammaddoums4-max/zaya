"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Phone,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/store/cart";
import { CategoryIcon } from "./icons";
import type { CategoryData } from "@/lib/types";
import { SITE } from "@/lib/constants";

export default function HeaderClient({
  categories,
}: {
  categories: CategoryData[];
}) {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const count = useCart((s) => s.count());
  const openCart = useCart((s) => s.open);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/boutique?q=${encodeURIComponent(q)}` : "/boutique");
  };

  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <>
      {/* Barre d'annonce */}
      <div className="bg-ink text-white">
        <div className="container-zaya flex h-9 items-center justify-between text-xs">
          <p className="flex items-center gap-1.5">
            <span className="hidden sm:inline">🚚 Livraison rapide partout en Guinée</span>
            <span className="sm:hidden">🚚 Livraison en Guinée</span>
          </p>
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-medium transition-colors hover:text-zaya-400"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Contact / Commande</span>
          </a>
        </div>
      </div>

      {/* En-tête principal */}
      <header
        className={`sticky top-0 z-50 bg-ink transition-shadow duration-300 ${
          scrolled ? "shadow-lg shadow-black/20" : ""
        }`}
      >
        <div className="container-zaya flex h-16 items-center gap-3 md:h-20 md:gap-6">
          {/* Burger mobile */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center" aria-label="Accueil ZAYA">
            <Image
              src="/logo-zaya.png"
              alt="ZAYA"
              width={150}
              height={50}
              priority
              className="logo-white h-8 w-auto md:h-10"
            />
          </Link>

          {/* Recherche (desktop) */}
          <form
            ref={formRef}
            onSubmit={submitSearch}
            className="hidden flex-1 md:block"
          >
            <div className="group flex items-center overflow-hidden rounded-full bg-white ring-2 ring-transparent transition focus-within:ring-zaya">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Rechercher un produit, une marque…"
                className="w-full bg-transparent px-5 py-3 text-sm text-ink outline-none placeholder:text-ink-muted"
              />
              <button
                type="submit"
                className="m-1 flex items-center gap-2 rounded-full bg-zaya px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zaya-600"
              >
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline">Rechercher</span>
              </button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1 md:gap-2">
            {/* Panier */}
            <button
              onClick={openCart}
              aria-label="Panier"
              className="relative flex h-11 items-center gap-2 rounded-xl px-2 text-white transition-colors hover:bg-white/10 md:px-3"
            >
              <span className="relative">
                <ShoppingCart className="h-6 w-6" />
                {mounted && count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-zaya px-1 text-[11px] font-bold text-white"
                  >
                    {count}
                  </motion.span>
                )}
              </span>
              <span className="hidden text-sm font-medium md:inline">Panier</span>
            </button>
          </div>
        </div>

        {/* Recherche (mobile) */}
        <div className="container-zaya pb-3 md:hidden">
          <form onSubmit={submitSearch}>
            <div className="flex items-center overflow-hidden rounded-full bg-white">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Rechercher sur ZAYA…"
                className="w-full bg-transparent px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-muted"
              />
              <button
                type="submit"
                aria-label="Rechercher"
                className="m-1 flex h-9 w-9 items-center justify-center rounded-full bg-zaya text-white"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Barre catégories (desktop) */}
        <nav className="hidden border-t border-white/10 bg-ink lg:block">
          <div className="container-zaya flex items-center gap-1 overflow-x-auto no-scrollbar">
            <Link
              href="/boutique"
              className="flex items-center gap-2 whitespace-nowrap px-3 py-3 text-sm font-semibold text-zaya-400"
            >
              <LayoutGrid className="h-4 w-4" />
              Toutes catégories
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categorie/${cat.slug}`}
                className="flex items-center gap-1.5 whitespace-nowrap px-3 py-3 text-sm text-white/80 transition-colors hover:text-zaya-400"
              >
                <CategoryIcon name={cat.icon} className="h-4 w-4" />
                {cat.name}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Menu mobile plein écran */}
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
                <Image
                  src="/logo-zaya.png"
                  alt="ZAYA"
                  width={120}
                  height={40}
                  className="logo-white h-8 w-auto"
                />
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Fermer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Catégories
                </p>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categorie/${cat.slug}`}
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-ink transition-colors hover:bg-zaya-50"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zaya-50 text-zaya">
                        <CategoryIcon name={cat.icon} className="h-5 w-5" />
                      </span>
                      {cat.name}
                    </span>
                    <ChevronRight className="h-4 w-4 text-ink-muted" />
                  </Link>
                ))}
              </div>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="m-3 flex items-center justify-center gap-2 rounded-xl bg-zaya px-4 py-3 text-sm font-semibold text-white"
              >
                <Phone className="h-4 w-4" /> Contacter ZAYA
              </a>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

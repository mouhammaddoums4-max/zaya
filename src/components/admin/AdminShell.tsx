"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import NotificationBell from "./NotificationBell";
import {
  LayoutDashboard,
  Package,
  Boxes,
  FolderTree,
  ShoppingCart,
  Ticket,
  Settings,
  Users,
  Bike,
  Palette,
  BarChart3,
  Megaphone,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/stock", label: "Stock", icon: Boxes },
  { href: "/admin/categories", label: "Catégories", icon: FolderTree },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingCart },
  { href: "/admin/clients", label: "CRM", icon: Users },
  { href: "/admin/visiteurs", label: "Visiteurs", icon: BarChart3 },
  { href: "/admin/livreurs", label: "Livreurs", icon: Bike },
  { href: "/admin/codes", label: "Codes promo", icon: Ticket },
  { href: "/admin/notifications", label: "Push", icon: Megaphone },
  { href: "/admin/apparence", label: "Apparence", icon: Palette },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

type DockItemProps = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  badge?: number;
  tone?: "default" | "danger";
};

/** Bouton du dock : icône + label flottant au survol. */
function DockButton({
  label,
  icon: Icon,
  active,
  badge,
  tone = "default",
}: DockItemProps) {
  return (
    <span className="group relative flex flex-col items-center">
      {/* Label flottant */}
      <span
        className="pointer-events-none absolute -top-11 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:-top-10 group-hover:opacity-100"
      >
        {label}
        <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-ink" />
      </span>

      {/* Icône */}
      <span
        className={cn(
          "relative flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-200 group-hover:-translate-y-1 group-hover:scale-110",
          active
            ? "bg-zaya text-white shadow-lg shadow-zaya/30"
            : tone === "danger"
              ? "text-red-500 hover:bg-red-500/10"
              : "text-ink/60 hover:bg-black/5 hover:text-ink",
        )}
      >
        <Icon className="h-6 w-6" />
        {badge && badge > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-zaya px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {badge > 99 ? "99+" : badge}
          </span>
        ) : null}
      </span>
    </span>
  );
}

export default function AdminShell({
  children,
  pendingCount = 0,
}: {
  children: React.ReactNode;
  pendingCount?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Topbar légère (branding) */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/5 bg-white/80 px-4 py-3 backdrop-blur sm:px-6">
        <Link href="/admin" className="flex items-center">
          <Image
            src="/logo-zaya.png"
            alt="ZAYA"
            width={100}
            height={34}
            className="h-7 w-auto"
          />
          <span className="ml-2 rounded bg-zaya px-1.5 py-0.5 text-[10px] font-bold text-white">
            ADMIN
          </span>
        </Link>
        <NotificationBell />
      </header>

      {/* Contenu — espace réservé en bas pour le dock */}
      <main className="p-4 pb-44 sm:p-6 sm:pb-44 lg:p-8 lg:pb-40">
        {children}
      </main>

      {/* Dock flottant centré */}
      <nav
        aria-label="Navigation admin"
        className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-3"
      >
        <div className="flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-[1.75rem] border border-black/5 bg-white/85 p-2.5 shadow-2xl shadow-black/15 backdrop-blur-xl">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} aria-label={item.label}>
              <DockButton
                label={item.label}
                icon={item.icon}
                active={isActive(item.href, item.exact)}
                badge={item.href === "/admin/commandes" ? pendingCount : undefined}
              />
            </Link>
          ))}

          {/* Séparateur */}
          <span className="mx-1 h-8 w-px shrink-0 bg-black/10" />

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Voir le site"
          >
            <DockButton label="Voir le site" icon={ExternalLink} />
          </a>

          <button onClick={logout} aria-label="Déconnexion">
            <DockButton label="Déconnexion" icon={LogOut} tone="danger" />
          </button>
        </div>
      </nav>
    </div>
  );
}

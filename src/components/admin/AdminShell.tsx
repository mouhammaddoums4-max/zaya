"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  BarChart3,
  Bike,
  Boxes,
  ChevronRight,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Package,
  Palette,
  Settings,
  ShoppingCart,
  Ticket,
  Users,
  type LucideIcon,
} from "lucide-react";
import NotificationBell from "./NotificationBell";
import { cn } from "@/lib/utils";

const NAV_GROUPS: {
  label: string;
  items: {
    href: string;
    label: string;
    icon: LucideIcon;
    exact?: boolean;
  }[];
}[] = [
  {
    label: "Boutique",
    items: [
      { href: "/admin", label: "Vue d’ensemble", icon: LayoutDashboard, exact: true },
      { href: "/admin/commandes", label: "Commandes", icon: ShoppingCart },
      { href: "/admin/produits", label: "Produits", icon: Package },
      { href: "/admin/stock", label: "Stock", icon: Boxes },
      { href: "/admin/categories", label: "Catégories", icon: FolderTree },
    ],
  },
  {
    label: "Clients",
    items: [
      { href: "/admin/clients", label: "CRM", icon: Users },
      { href: "/admin/livreurs", label: "Livreurs", icon: Bike },
    ],
  },
  {
    label: "Marketing",
    items: [
      { href: "/admin/codes", label: "Codes promo", icon: Ticket },
    ],
  },
];

const NAV_ITEMS = NAV_GROUPS.flatMap((group) => group.items);

function NavigationLink({
  href,
  label,
  icon: Icon,
  active,
  badge,
  compact = false,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  badge?: number;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex shrink-0 items-center rounded-xl text-sm font-medium transition-colors",
        compact ? "gap-2 px-3 py-2" : "gap-3 px-3 py-2.5",
        active
          ? "bg-orange-50 text-orange-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
      )}
    >
      <Icon
        className={cn(
          "shrink-0",
          compact ? "h-4 w-4" : "h-[18px] w-[18px]",
          active ? "text-orange-600" : "text-slate-400 group-hover:text-slate-600",
        )}
      />
      <span className="whitespace-nowrap">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
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
  const activeItem =
    NAV_ITEMS.find((item) =>
      item.exact ? pathname === item.href : pathname.startsWith(item.href),
    ) ?? NAV_ITEMS[0];

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#f6f7f8] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col border-r border-slate-200 bg-white lg:flex">
        <Link
          href="/admin"
          className="flex h-[72px] items-center gap-3 border-b border-slate-100 px-6"
        >
          <Image
            src="/logo-zaya.png"
            alt="ZAYA"
            width={100}
            height={34}
            className="h-7 w-auto"
            priority
          />
          <span className="rounded-md bg-orange-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-orange-700">
            Admin
          </span>
        </Link>

        <nav aria-label="Navigation admin" className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
          {NAV_GROUPS.map((group) => (
            <section key={group.label}>
              <h2 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                {group.label}
              </h2>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavigationLink
                    key={item.href}
                    {...item}
                    active={
                      item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href)
                    }
                    badge={
                      item.href === "/admin/commandes" ? pendingCount : undefined
                    }
                  />
                ))}
              </div>
            </section>
          ))}
        </nav>

      </aside>

      <div className="min-h-screen lg:pl-[264px]">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-[64px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Link href="/admin" className="flex shrink-0 items-center gap-2 lg:hidden">
                <Image
                  src="/logo-zaya.png"
                  alt="ZAYA"
                  width={84}
                  height={30}
                  className="h-6 w-auto"
                  priority
                />
              </Link>
              <div className="hidden items-center gap-2 text-sm text-slate-400 sm:flex">
                <span>Administration</span>
                <ChevronRight className="h-4 w-4" />
              </div>
              <h1 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                {activeItem.label}
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Link
                href="/admin/visiteurs"
                aria-label="Visiteurs"
                title="Visiteurs"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <BarChart3 className="h-[18px] w-[18px]" />
              </Link>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Voir la boutique"
                title="Voir la boutique"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <ArrowUpRight className="h-[18px] w-[18px]" />
              </a>
              <Link
                href="/admin/parametres"
                aria-label="Paramètres"
                title="Paramètres"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <Settings className="h-[18px] w-[18px]" />
              </Link>
              <Link
                href="/admin/notifications"
                aria-label="Notifications push"
                title="Notifications push"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <Megaphone className="h-[18px] w-[18px]" />
              </Link>
              <NotificationBell />
              <button
                onClick={logout}
                aria-label="Déconnexion"
                title="Déconnexion"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>

          <nav
            aria-label="Navigation admin mobile"
            className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2 lg:hidden"
          >
            {NAV_ITEMS.map((item) => (
              <NavigationLink
                key={item.href}
                {...item}
                compact
                active={
                  item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href)
                }
                badge={
                  item.href === "/admin/commandes" ? pendingCount : undefined
                }
              />
            ))}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 pb-10 sm:px-6 sm:py-8 lg:px-8 lg:py-9">
          {children}
        </main>
      </div>
    </div>
  );
}

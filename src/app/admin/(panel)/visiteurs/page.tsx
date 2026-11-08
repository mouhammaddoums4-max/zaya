import { prisma } from "@/lib/prisma";
import { Eye, TrendingUp, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

function lastDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function label(path: string): string {
  if (path === "/") return "Accueil";
  if (path === "/boutique") return "Boutique";
  if (path.startsWith("/produit/")) return "Produit : " + path.replace("/produit/", "");
  if (path.startsWith("/categorie/")) return "Catégorie : " + path.replace("/categorie/", "");
  return path;
}

export default async function AdminVisitorsPage() {
  const days = lastDays(7);
  const today = days[days.length - 1];

  const visits = await prisma.visit.findMany({
    where: { day: { in: days } },
  });

  const perDay = new Map<string, number>(days.map((d) => [d, 0]));
  const perPath = new Map<string, number>();
  let total7 = 0;
  let todayTotal = 0;
  for (const v of visits) {
    perDay.set(v.day, (perDay.get(v.day) || 0) + v.count);
    perPath.set(v.path, (perPath.get(v.path) || 0) + v.count);
    total7 += v.count;
    if (v.day === today) todayTotal += v.count;
  }
  const maxDay = Math.max(1, ...perDay.values());
  const topPaths = [...perPath.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);

  const cards = [
    { label: "Vues aujourd'hui", value: todayTotal, icon: Eye },
    { label: "Vues (7 jours)", value: total7, icon: TrendingUp },
    { label: "Pages visitées", value: perPath.size, icon: FileText },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Visiteurs</h1>
        <p className="text-sm text-ink-muted">Fréquentation du site (7 derniers jours)</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zaya-50 text-zaya">
              <c.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 font-display text-2xl font-bold sm:text-3xl">{c.value}</p>
            <p className="text-sm text-ink-muted">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Graphe 7 jours */}
      <div className="mt-6 rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
        <h2 className="mb-4 font-display font-bold">Vues par jour</h2>
        <div className="flex items-end justify-between gap-2" style={{ height: 160 }}>
          {days.map((d) => {
            const v = perDay.get(d) || 0;
            const h = Math.round((v / maxDay) * 130) + 4;
            return (
              <div key={d} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[11px] font-semibold text-ink">{v}</span>
                <div className="w-full rounded-t-md bg-zaya" style={{ height: h }} />
                <span className="text-[10px] text-ink-muted">
                  {new Date(d).toLocaleDateString("fr-FR", { weekday: "short" })}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top pages */}
      <div className="mt-6 rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
        <h2 className="mb-4 font-display font-bold">Pages les plus visitées</h2>
        {topPaths.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-muted">
            Aucune donnée pour l'instant. Les visites apparaîtront ici.
          </p>
        ) : (
          <div className="space-y-2">
            {topPaths.map(([path, count]) => (
              <div key={path} className="flex items-center justify-between gap-3 text-sm">
                <span className="line-clamp-1 text-ink/80">{label(path)}</span>
                <span className="shrink-0 rounded-full bg-zaya-50 px-2.5 py-0.5 text-xs font-bold text-zaya">
                  {count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

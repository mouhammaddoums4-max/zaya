import { Truck, ShieldCheck, Headphones, Gift } from "lucide-react";

const BADGES = [
  { icon: Truck, title: "Livraison rapide", desc: "Partout en Guinée" },
  { icon: ShieldCheck, title: "Paiement sécurisé", desc: "En toute confiance" },
  { icon: Headphones, title: "Service client", desc: "À votre écoute" },
  { icon: Gift, title: "Retours faciles", desc: "Sans tracas" },
];

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {BADGES.map((b) => (
        <div
          key={b.title}
          className="flex items-center gap-3 rounded-xl bg-zaya-50/70 px-4 py-3.5 ring-1 ring-zaya-100"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-zaya ring-1 ring-zaya-100">
            <b.icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{b.title}</p>
            <p className="truncate text-xs text-ink-muted">{b.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

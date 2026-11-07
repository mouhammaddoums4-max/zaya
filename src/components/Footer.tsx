import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/data";
import { SITE } from "@/lib/constants";
import { Truck, ShieldCheck, Headphones, CreditCard } from "lucide-react";

export default async function Footer() {
  const categories = await getCategories();

  const perks = [
    { icon: Truck, title: "Livraison rapide", desc: "Partout en Guinée" },
    { icon: CreditCard, title: "Paiement à la livraison", desc: "Payez en recevant" },
    { icon: ShieldCheck, title: "Achat sécurisé", desc: "Vos données protégées" },
    { icon: Headphones, title: "Support 7j/7", desc: "Une équipe à l'écoute" },
  ];

  return (
    <footer className="mt-16 bg-ink text-white">
      {/* Avantages */}
      <div className="border-b border-white/10">
        <div className="container-zaya grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {perks.map((p) => (
            <div key={p.title} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zaya/15 text-zaya-400">
                <p.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">{p.title}</p>
                <p className="text-xs text-white/60">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-zaya grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Image
            src="/logo-zaya.png"
            alt="ZAYA"
            width={140}
            height={46}
            className="logo-white h-9 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm text-white/60">{SITE.description}</p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold">Catégories</h3>
          <ul className="space-y-2 text-sm text-white/60">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link href={`/categorie/${c.slug}`} className="transition-colors hover:text-zaya-400">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold">ZAYA</h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/boutique" className="hover:text-zaya-400">Boutique</Link></li>
            <li><Link href="/panier" className="hover:text-zaya-400">Mon panier</Link></li>
            <li><Link href="/a-propos" className="hover:text-zaya-400">À propos</Link></li>
            <li><Link href="/admin" className="hover:text-zaya-400">Espace admin</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold">Contact</h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li>
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-zaya-400">
                WhatsApp
              </a>
            </li>
            <li>Conakry, Guinée</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-zaya flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} ZAYA. Tous droits réservés.</p>
          <p>Fait avec passion en Guinée 🇬🇳</p>
        </div>
      </div>
    </footer>
  );
}

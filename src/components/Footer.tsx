import Link from "next/link";
import Image from "next/image";
import { Facebook, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { SITE } from "@/lib/constants";
import Newsletter from "./Newsletter";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.03c-.24.68-1.42 1.3-1.95 1.35-.5.05-1.13.07-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-2.99s.75-2.12 1.01-2.41c.26-.29.57-.36.76-.36l.54.01c.17.01.41-.07.64.49.24.57.82 1.99.89 2.13.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.3.37-.42.5-.14.14-.29.29-.12.57.17.29.74 1.22 1.59 1.98 1.09.97 2.01 1.27 2.3 1.42.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.64-.14.26.09 1.67.79 1.96.93.29.14.48.21.55.33.07.12.07.68-.17 1.36z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.3v12.9a2.59 2.59 0 1 1-2.59-2.59c.27 0 .53.04.78.12v-3.36a5.94 5.94 0 0 0-.78-.05 5.94 5.94 0 1 0 5.94 5.94V9.4a7.56 7.56 0 0 0 4.42 1.42V7.5a4.28 4.28 0 0 1-3.41-1.68z" />
    </svg>
  );
}

export default async function Footer() {
  const socials = [
    { icon: Facebook, href: "#", label: "Facebook", color: "bg-[#1877F2]" },
    { icon: Youtube, href: "#", label: "YouTube", color: "bg-[#FF0000]" },
    { icon: WhatsAppIcon, href: `https://wa.me/${SITE.whatsapp}`, label: "WhatsApp", color: "bg-[#25D366]" },
    { icon: TikTokIcon, href: "#", label: "TikTok", color: "bg-black" },
  ];

  return (
    <footer className="relative mt-12 overflow-hidden bg-ink text-white">
      {/* Décor mandala */}
      <Image
        src="/mandala.png"
        alt=""
        aria-hidden
        width={340}
        height={340}
        className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 opacity-10"
      />

      <div className="container-zaya relative grid gap-8 py-12 md:grid-cols-4">
        <div>
          <Image src="/logo-zaya.png" alt="ZAYA" width={140} height={46} className="logo-white h-9 w-auto" />
          <p className="mt-3 text-sm text-white/60">Achetez malin. Vendez facilement.</p>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-bold">Liens utiles</h3>
          <ul className="space-y-2.5 text-sm text-white/60">
            <li><Link href="/" className="hover:text-zaya-400">Accueil</Link></li>
            <li><Link href="/boutique?filtre=promo" className="hover:text-zaya-400">Promotions</Link></li>
            <li><Link href="/a-propos" className="hover:text-zaya-400">À propos</Link></li>
            <li><a href={`https://wa.me/${SITE.whatsapp}`} className="hover:text-zaya-400">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-bold">Service client</h3>
          <ul className="space-y-2.5 text-sm text-white/60">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-zaya-400" /> +{SITE.whatsapp}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-zaya-400" /> {SITE.email}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-zaya-400" /> Conakry, Guinée
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-bold">Restez connecté</h3>
          <div className="mb-4 flex gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className={`flex h-9 w-9 items-center justify-center rounded-full ${s.color} text-white transition hover:opacity-90`}
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <Newsletter />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-zaya flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} ZAYA. Tous droits réservés.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href="/politiques" className="hover:text-white">Politique de vente</Link>
            <Link href="/politiques" className="hover:text-white">Confidentialité</Link>
            <Link href="/a-propos" className="hover:text-white">À propos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

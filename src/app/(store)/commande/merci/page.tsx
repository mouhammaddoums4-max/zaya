import Link from "next/link";
import { CheckCircle2, Phone, Home } from "lucide-react";
import { SITE } from "@/lib/constants";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "Commande confirmée" };

type Props = {
  searchParams: Promise<{ ref?: string; total?: string }>;
};

export default async function MerciPage({ searchParams }: Props) {
  const sp = await searchParams;
  const ref = sp.ref || "—";
  const total = sp.total ? Number(sp.total) : null;

  const waMessage = `Bonjour ZAYA 👋, je viens de passer la commande ${ref}${
    total ? ` d'un montant de ${formatPrice(total)}` : ""
  }. Je souhaite confirmer la livraison.`;
  const waLink = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="container-zaya flex flex-col items-center py-16 text-center sm:py-24">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold">Commande confirmée ! 🎉</h1>
      <p className="mt-2 max-w-md text-ink-muted">
        Merci pour votre confiance. Notre équipe va vous contacter très vite pour
        organiser la livraison. <strong>Paiement à la réception.</strong>
      </p>

      <div className="mt-6 rounded-2xl bg-white px-6 py-4 shadow-card ring-1 ring-black/5">
        <p className="text-sm text-ink-muted">Référence de commande</p>
        <p className="font-display text-2xl font-bold text-zaya">{ref}</p>
        {total != null && (
          <p className="mt-1 text-sm">
            Montant : <strong>{formatPrice(total)}</strong>
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Phone className="h-4 w-4" /> Confirmer sur WhatsApp
        </a>
        <Link href="/boutique" className="btn-ghost">
          <Home className="h-4 w-4" /> Continuer mes achats
        </Link>
      </div>
    </div>
  );
}

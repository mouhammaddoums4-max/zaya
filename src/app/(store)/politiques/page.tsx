import { ShoppingBag, Truck, CreditCard, RefreshCcw, ShieldCheck, Phone } from "lucide-react";
import { SITE } from "@/lib/constants";

export const metadata = {
  title: "Politique de vente",
  description: "Conditions de vente, livraison, paiement et confidentialité de ZAYA.",
};

const SECTIONS = [
  {
    icon: ShoppingBag,
    title: "1. Commande",
    body: [
      "Aucune création de compte n'est nécessaire. Pour commander, le client indique simplement son nom, son numéro de téléphone, son lieu de livraison et la quantité souhaitée.",
      "Après validation, un numéro de commande (référence) est généré. Le client reçoit une confirmation par SMS et notre équipe le rappelle pour confirmer la livraison.",
    ],
  },
  {
    icon: CreditCard,
    title: "2. Paiement",
    body: [
      "Le paiement se fait à la livraison (paiement à la réception). Le client règle le montant total en espèces au moment où il reçoit sa commande.",
      "Les prix sont affichés en Franc Guinéen (FG) et incluent le prix du produit. Les frais de livraison éventuels sont indiqués avant la validation.",
    ],
  },
  {
    icon: Truck,
    title: "3. Livraison",
    body: [
      "Nous livrons partout en Guinée. Les délais dépendent de la localité ; ils sont communiqués lors de l'appel de confirmation.",
      "Le client doit être joignable au numéro fourni. En cas d'absence répétée, la commande peut être annulée.",
    ],
  },
  {
    icon: RefreshCcw,
    title: "4. Retours & remboursement",
    body: [
      "Un produit défectueux ou non conforme peut être signalé au moment de la livraison ou dans un délai raisonnable après réception.",
      "Après vérification, ZAYA procède à l'échange ou au remboursement du produit concerné.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "5. Confidentialité",
    body: [
      "Les informations fournies (nom, téléphone, lieu) sont utilisées uniquement pour traiter et livrer la commande.",
      "Nous ne partageons jamais vos données avec des tiers à des fins commerciales.",
    ],
  },
];

export default function PolitiquesPage() {
  return (
    <div className="bg-white">
      <section className="bg-ink py-12 text-white">
        <div className="container-zaya">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Politique de vente
          </h1>
          <p className="mt-2 max-w-2xl text-white/70">
            Nos conditions de commande, de paiement, de livraison et de
            confidentialité — simples et transparentes.
          </p>
        </div>
      </section>

      <div className="container-zaya max-w-3xl py-10">
        <div className="space-y-6">
          {SECTIONS.map((s) => (
            <div key={s.title} className="rounded-2xl bg-neutral-50 p-5 ring-1 ring-black/5">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zaya-50 text-zaya">
                  <s.icon className="h-5 w-5" />
                </span>
                {s.title}
              </h2>
              <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink/80">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-3 rounded-2xl bg-zaya-50 p-5 ring-1 ring-zaya-100">
          <Phone className="h-6 w-6 shrink-0 text-zaya" />
          <p className="text-sm text-ink">
            Une question ? Contactez-nous sur WhatsApp au{" "}
            <a href={`https://wa.me/${SITE.whatsapp}`} className="font-semibold text-zaya">
              +{SITE.whatsapp}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Truck, ShieldCheck, Heart, Target } from "lucide-react";

export const metadata = {
  title: "À propos",
  description: "ZAYA, votre marketplace de confiance en Guinée.",
};

export default function AProposPage() {
  const values = [
    { icon: Truck, t: "Livraison fiable", d: "Nous livrons rapidement partout en Guinée." },
    { icon: ShieldCheck, t: "Confiance", d: "Paiement à la livraison et produits vérifiés." },
    { icon: Heart, t: "Proximité", d: "Un service client à votre écoute, en français." },
    { icon: Target, t: "Meilleurs prix", d: "Des promotions et ventes flash chaque jour." },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-ink py-16 text-white">
        <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-zaya/30 blur-3xl" />
        <div className="container-zaya relative text-center">
          <Image
            src="/logo-zaya.png"
            alt="ZAYA"
            width={180}
            height={60}
            className="logo-white mx-auto h-12 w-auto"
          />
          <h1 className="mt-6 font-display text-3xl font-bold sm:text-4xl">
            Le shopping en ligne, <span className="text-gradient-zaya">simplifié</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            ZAYA est né d'une idée simple : permettre à chacun en Guinée d'acheter
            facilement, en toute confiance, les meilleurs produits au meilleur prix,
            livrés directement chez soi.
          </p>
        </div>
      </section>

      <div className="container-zaya py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.t}
              className="rounded-2xl bg-white p-6 text-center shadow-card ring-1 ring-black/5"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zaya-50 text-zaya">
                <v.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display font-bold">{v.t}</h3>
              <p className="mt-1 text-sm text-ink-muted">{v.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/boutique" className="btn-primary">
            Découvrir la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}

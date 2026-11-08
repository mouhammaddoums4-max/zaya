import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment ZAYA collecte, utilise et protège les informations nécessaires aux commandes et au fonctionnement du site.",
};

const SECTIONS = [
  {
    id: "informations",
    title: "1. Informations que nous utilisons",
    paragraphs: [
      "Pour traiter une commande, nous utilisons le nom, le numéro de téléphone, le lieu de livraison, les articles commandés et, si vous en indiquez une, votre note de livraison.",
      "Le site comptabilise également les pages consultées par jour afin de suivre sa fréquentation. Ces statistiques sont regroupées par page et par jour dans notre application.",
      "Le paiement étant effectué à la livraison, ZAYA ne demande pas les coordonnées de votre carte bancaire sur ce site.",
    ],
  },
  {
    id: "utilisation",
    title: "2. Utilisation des informations",
    paragraphs: [
      "Les informations de commande servent à confirmer votre achat, organiser la livraison, vous contacter au sujet de celle-ci et assurer le service après-vente.",
      "Les informations de fréquentation servent à comprendre quelles pages sont consultées et à améliorer le fonctionnement de la boutique.",
    ],
  },
  {
    id: "partage",
    title: "3. Partage avec des prestataires",
    paragraphs: [
      "Nous ne vendons pas vos coordonnées. Les informations nécessaires au traitement de la commande peuvent être communiquées aux personnes qui la préparent ou la livrent.",
      "Pour les notifications liées aux commandes, ZAYA peut utiliser des prestataires d'envoi de SMS et d'e-mail. Les liens de partage ouvrent les services externes que vous choisissez, comme WhatsApp, Facebook ou X ; leur utilisation est alors régie par les règles de ces services.",
    ],
  },
  {
    id: "stockage",
    title: "4. Stockage sur votre appareil",
    paragraphs: [
      "Le panier, les favoris et certains choix du site sont enregistrés dans le stockage local de votre navigateur pour que vous puissiez les retrouver. Le choix concernant le bandeau de consentement est également mémorisé sur cet appareil.",
      "Vous pouvez effacer ces données depuis les paramètres de votre navigateur. Le panier et les préférences enregistrés localement peuvent alors être perdus.",
    ],
  },
  {
    id: "conservation",
    title: "5. Conservation et sécurité",
    paragraphs: [
      "Les données de commande sont conservées dans le système de gestion de ZAYA pour permettre le suivi des commandes et du service client. Les statistiques de consultation sont conservées sous forme de totaux par page et par jour.",
      "Nous appliquons des mesures de protection adaptées à la gestion du site. Aucun mode de transmission ou de stockage ne peut toutefois être garanti comme absolument sûr.",
    ],
  },
  {
    id: "choix",
    title: "6. Vos choix et vos demandes",
    paragraphs: [
      "Vous pouvez nous contacter pour demander des renseignements sur les informations liées à votre commande, ou solliciter leur rectification ou leur suppression lorsque cela est possible.",
      "Pour une demande, indiquez la référence de commande et contactez-nous par e-mail ou WhatsApp. Nous pourrons vous demander des éléments permettant de vérifier votre demande.",
    ],
  },
];

export default function ConfidentialitePage() {
  return (
    <div className="bg-white">
      <header className="border-b border-black/5 bg-neutral-50 py-10 sm:py-14">
        <div className="container-zaya">
          <p className="text-sm font-semibold text-zaya">ZAYA · Informations légales</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
            Politique de confidentialité
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-muted sm:text-base">
            Cette page explique quelles informations sont utilisées lorsque vous
            visitez ZAYA ou passez une commande, et comment nous contacter à leur sujet.
          </p>
          <p className="mt-3 text-xs text-ink-muted">
            Mise à jour : 8 novembre 2026
          </p>
        </div>
      </header>

      <div className="container-zaya grid gap-8 py-8 sm:py-10 lg:grid-cols-[220px_minmax(0,760px)] lg:justify-center">
        <nav
          aria-label="Sommaire de la politique de confidentialité"
          className="h-fit rounded-xl border border-black/5 bg-neutral-50 p-4 lg:sticky lg:top-24"
        >
          <h2 className="mb-3 text-sm font-bold text-ink">Sur cette page</h2>
          <ol className="space-y-2.5 text-sm text-ink-muted">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a className="hover:text-zaya" href={`#${section.id}`}>
                  {section.title.replace(/^\d+\.\s/, "")}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <main className="min-w-0">
          <div className="space-y-4">
            {SECTIONS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-xl border border-black/5 p-5 sm:p-6"
              >
                <h2 className="font-display text-lg font-bold text-ink sm:text-xl">
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-6 text-ink/75">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-5 rounded-xl bg-zaya-50 p-5 text-sm leading-6 text-ink">
            <h2 className="font-display font-bold">Nous contacter</h2>
            <p className="mt-2">
              Pour toute question liée à cette politique, écrivez à{" "}
              <a className="font-semibold text-zaya" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>{" "}
              ou contactez-nous sur{" "}
              <a
                className="font-semibold text-zaya"
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp au +{SITE.whatsapp}
              </a>
              .
            </p>
            <p className="mt-2">
              Consultez aussi notre{" "}
              <Link className="font-semibold text-zaya" href="/politiques">
                politique de vente
              </Link>
              .
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

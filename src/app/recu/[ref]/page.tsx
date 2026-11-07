import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { verifyReceiptToken } from "@/lib/receipt";
import { formatPrice } from "@/lib/format";
import { SITE } from "@/lib/constants";
import Barcode from "@/components/Barcode";
import PrintButton from "@/components/PrintButton";
import { CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reçu de paiement", robots: { index: false } };

type Props = {
  params: Promise<{ ref: string }>;
  searchParams: Promise<{ t?: string }>;
};

export default async function ReceiptPage({ params, searchParams }: Props) {
  const { ref } = await params;
  const { t } = await searchParams;

  if (!verifyReceiptToken(ref, t || "")) notFound();

  const order = await prisma.order.findUnique({
    where: { reference: ref },
    include: { items: true },
  });
  if (!order) notFound();

  const date = new Date(order.paidAt || order.createdAt).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-neutral-200 px-4 py-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-sm">
        {/* Ticket */}
        <div className="relative bg-white px-7 py-8 shadow-xl print:shadow-none">
          {/* Logo + entête */}
          <div className="text-center">
            <Image
              src="/logo-zaya.png"
              alt="ZAYA"
              width={150}
              height={50}
              className="mx-auto h-10 w-auto"
            />
            <p className="mt-3 text-xs uppercase tracking-[0.3em] text-ink-muted">
              Reçu de paiement
            </p>
          </div>

          <div className="my-5 border-t-2 border-dashed border-black/15" />

          {/* Code-barres */}
          <div className="text-center">
            <Barcode value={order.reference} className="mx-auto h-14 w-64 max-w-full" />
            <p className="mt-2 font-mono text-lg font-bold tracking-widest">
              {order.reference}
            </p>
            <p className="text-xs text-ink-muted">{date}</p>
          </div>

          {order.paid && (
            <div className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 py-1.5 text-sm font-bold text-emerald-600">
              <CheckCircle2 className="h-4 w-4" /> PAYÉ
            </div>
          )}

          <div className="my-5 border-t-2 border-dashed border-black/15" />

          {/* Articles */}
          <div className="space-y-2 text-sm">
            {order.items.map((it) => (
              <div key={it.id} className="flex justify-between gap-2">
                <span className="text-ink/80">
                  {it.quantity} × {it.productName}
                </span>
                <span className="whitespace-nowrap font-medium">
                  {formatPrice(it.price * it.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="my-4 border-t-2 border-dashed border-black/15" />

          {/* Totaux */}
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-ink-muted">
              <span>Sous-total</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Remise{order.promoCode ? ` (${order.promoCode})` : ""}</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-ink-muted">
              <span>Livraison</span>
              <span>{order.deliveryFee === 0 ? "Offerte" : formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-black/10 pt-2 text-base font-bold">
              <span>TOTAL</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="my-5 border-t-2 border-dashed border-black/15" />

          {/* Client */}
          <div className="text-xs text-ink-muted">
            <p>Client : <span className="font-semibold text-ink">{order.customerName}</span></p>
            <p>Téléphone : {order.phone}</p>
            <p>Livraison : {order.location}</p>
          </div>

          <p className="mt-6 text-center font-display text-lg font-bold text-ink">
            Merci pour votre confiance ! 🧡
          </p>

          {/* Adresse ZAYA */}
          <div className="mt-5 border-t-2 border-dashed border-black/15 pt-4 text-center text-[11px] text-ink-muted">
            <p className="font-semibold text-ink">ZAYA Market</p>
            <p>Conakry, Guinée</p>
            <p>{SITE.email} · +{SITE.whatsapp}</p>
            <p>{SITE.url.replace("https://", "")}</p>
          </div>
        </div>

        <div className="mt-5 print:hidden">
          <PrintButton />
        </div>
      </div>
    </div>
  );
}

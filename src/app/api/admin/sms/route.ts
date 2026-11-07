import { NextResponse } from "next/server";
import { getCrmClients, type Segment } from "@/lib/crm";
import { sendSms, normalizePhoneGN } from "@/lib/sms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SEGMENTS = ["TOUS", "VIP", "RECURRENT", "NOUVEAU"] as const;
type Target = (typeof SEGMENTS)[number];

export async function POST(req: Request) {
  let body: { message?: string; segment?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const message = (body.message || "").trim();
  const segment = (body.segment || "TOUS") as Target;

  if (!message) {
    return NextResponse.json({ error: "Message vide" }, { status: 400 });
  }
  if (message.length > 480) {
    return NextResponse.json(
      { error: "Message trop long (max 480 caractères)" },
      { status: 400 },
    );
  }
  if (!SEGMENTS.includes(segment)) {
    return NextResponse.json({ error: "Segment invalide" }, { status: 400 });
  }

  const clients = await getCrmClients();
  const targets =
    segment === "TOUS"
      ? clients
      : clients.filter((c) => c.segment === (segment as Segment));

  // Numéros normalisés et dédupliqués
  const phones = Array.from(
    new Set(
      targets
        .map((c) => normalizePhoneGN(c.phone))
        .filter((n): n is string => Boolean(n)),
    ),
  );

  if (phones.length === 0) {
    return NextResponse.json(
      { error: "Aucun destinataire pour ce segment" },
      { status: 400 },
    );
  }

  // Envoi par lots de 50 (best-effort, ne bloque jamais)
  for (let i = 0; i < phones.length; i += 50) {
    await sendSms(phones.slice(i, i + 50), message);
  }

  const configured = Boolean(
    process.env.NIMBA_SERVICE_ID && process.env.NIMBA_SECRET_TOKEN,
  );

  return NextResponse.json({
    ok: true,
    recipients: phones.length,
    configured,
  });
}

import { NextResponse } from "next/server";
import { getNimbaMissingVariables } from "@/lib/sms";

export const dynamic = "force-dynamic";

/**
 * Diagnostic public : indique si les intégrations sont configurées
 * sur le serveur déployé, SANS jamais exposer les valeurs secrètes.
 * À ouvrir : https://VOTRE-SITE/api/health
 */
export async function GET() {
  const smsMissing = getNimbaMissingVariables();
  const authSecret = process.env.AUTH_SECRET || "";

  return NextResponse.json({
    ok: true,
    env: process.env.NODE_ENV,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
    sms: {
      configured: smsMissing.length === 0,
      missing: smsMissing, // ex: ["NIMBA_SERVICE_ID","NIMBA_SECRET_TOKEN"]
      sender: process.env.NIMBA_SENDER_NAME || null,
    },
    auth: { secretOk: authSecret.length >= 32 },
    push: { configured: Boolean(process.env.VAPID_PRIVATE_KEY) },
    email: { configured: Boolean(process.env.RESEND_API_KEY) },
    database: { set: Boolean(process.env.DATABASE_URL) },
  });
}

import "server-only";

/** Normalise un numéro guinéen au format international 224XXXXXXXXX (sans +). */
export function normalizePhoneGN(raw: string): string | null {
  let d = (raw || "").replace(/[^0-9]/g, "");
  if (!d) return null;
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("224")) {
    // ok
  } else {
    if (d.startsWith("0")) d = d.slice(1);
    d = "224" + d;
  }
  // Guinée : 224 + 9 chiffres
  if (d.length < 11 || d.length > 13) return null;
  return d;
}

/**
 * Envoie un SMS via Nimba SMS (https://nimbasms.com).
 * Best-effort : ne lève jamais d'erreur bloquante.
 */
export async function sendSms(
  to: string | string[],
  message: string,
): Promise<void> {
  const serviceId = process.env.NIMBA_SERVICE_ID;
  const token = process.env.NIMBA_SECRET_TOKEN;
  const baseUrl = process.env.NIMBA_BASE_URL || "https://api.nimbasms.com";
  const sender = process.env.NIMBA_SENDER_NAME || "ZAYA";
  if (!serviceId || !token) return; // SMS désactivé si non configuré

  const numbers = (Array.isArray(to) ? to : [to])
    .map((n) => normalizePhoneGN(n))
    .filter((n): n is string => Boolean(n));
  if (numbers.length === 0) return;

  const auth = Buffer.from(`${serviceId}:${token}`).toString("base64");

  try {
    await fetch(`${baseUrl.replace(/\/$/, "")}/v1/messages/`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: numbers,
        message,
        sender_name: sender,
      }),
    });
  } catch {
    // on n'interrompt jamais la commande à cause du SMS
  }
}

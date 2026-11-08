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

type NimbaConfig = {
  serviceId: string;
  token: string;
  baseUrl: string;
  sender: string;
  missingVariables: string[];
};

function getNimbaConfig(): NimbaConfig {
  const read = (name: string) => {
    const value = process.env[name]?.trim() || "";
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      return value.slice(1, -1).trim();
    }
    return value;
  };

  const serviceId = read("NIMBA_SERVICE_ID");
  const token = read("NIMBA_SECRET_TOKEN");
  return {
    serviceId,
    token,
    baseUrl: read("NIMBA_BASE_URL") || "https://api.nimbasms.com",
    sender: read("NIMBA_SENDER_NAME") || "ZAYA",
    missingVariables: [
      ...(!serviceId ? ["NIMBA_SERVICE_ID"] : []),
      ...(!token ? ["NIMBA_SECRET_TOKEN"] : []),
    ],
  };
}

export function getNimbaMissingVariables(): string[] {
  return getNimbaConfig().missingVariables;
}

export type SmsSendResult = {
  configured: boolean;
  sent: boolean;
  missingVariables?: string[];
  error?: string;
};

async function getNimbaError(response: Response): Promise<string> {
  if (response.status === 401) {
    return "Nimba refuse l'authentification. Vérifiez NIMBA_SERVICE_ID et NIMBA_SECRET_TOKEN pour la même organisation.";
  }
  if (response.status === 403) {
    return "Le compte Nimba n'est pas autorisé à envoyer des SMS.";
  }
  if (response.status === 429) {
    return "La limite d'envoi Nimba est atteinte. Réessayez plus tard.";
  }

  try {
    const body: unknown = await response.json();
    if (body && typeof body === "object") {
      const details = Array.isArray(body)
        ? body
        : Object.values(body as Record<string, unknown>);
      const message = details.find(
        (value): value is string =>
          typeof value === "string" && value.trim().length > 0,
      );
      if (message) return `Nimba : ${message.slice(0, 240)}`;
    }
  } catch {
    // Keep a useful status message when Nimba returns a non-JSON response.
  }

  return `Nimba a refusé l'envoi (HTTP ${response.status}). Vérifiez le nom d'expéditeur et le solde du compte.`;
}

/**
 * Envoie un SMS via Nimba SMS (https://nimbasms.com).
 * Retourne le résultat sans exposer les identifiants ni la réponse du fournisseur.
 */
export async function sendSms(
  to: string | string[],
  message: string,
): Promise<SmsSendResult> {
  const config = getNimbaConfig();
  if (config.missingVariables.length > 0) {
    return {
      configured: false,
      sent: false,
      missingVariables: config.missingVariables,
    };
  }

  const numbers = (Array.isArray(to) ? to : [to])
    .map((n) => normalizePhoneGN(n))
    .filter((n): n is string => Boolean(n));
  if (numbers.length === 0) {
    return { configured: true, sent: false, error: "Aucun numéro valide" };
  }

  const auth = Buffer.from(`${config.serviceId}:${config.token}`).toString("base64");

  try {
    const response = await fetch(
      `${config.baseUrl.replace(/\/$/, "")}/v1/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: numbers,
          message,
          sender_name: config.sender,
        }),
      },
    );
    if (!response.ok) {
      return {
        configured: true,
        sent: false,
        error: await getNimbaError(response),
      };
    }
    return { configured: true, sent: true };
  } catch {
    return {
      configured: true,
      sent: false,
      error: "Impossible de joindre le service Nimba SMS",
    };
  }
}

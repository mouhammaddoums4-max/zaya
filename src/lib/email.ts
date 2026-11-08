import "server-only";

type OrderEmailData = {
  reference: string;
  customerName: string;
  phone: string;
  location: string;
  note: string | null;
  total: number;
  items: { productName: string; quantity: number; price: number }[];
};

type DeliveredOrderEmailData = {
  reference: string;
  customerName: string;
  location: string;
  receivedBy: string;
  deliveredAt: Date;
};

const fmt = (n: number) =>
  `${new Intl.NumberFormat("fr-FR").format(n)} FG`;

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });

/**
 * Envoie un email de notification à l'admin pour une nouvelle commande.
 * Utilise Resend (https://resend.com). Si RESEND_API_KEY n'est pas défini,
 * la fonction ne fait rien (jamais d'erreur bloquante pour la commande).
 */
export async function sendOrderNotification(order: OrderEmailData) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_EMAIL || "mouhammaddoums4@gmail.com";
  const from = process.env.EMAIL_FROM || "ZAYA <onboarding@resend.dev>";
  if (!key) return; // email désactivé tant qu'aucune clé n'est fournie

  const rows = order.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0">${i.quantity} × ${i.productName}</td><td style="padding:6px 0;text-align:right">${fmt(i.price * i.quantity)}</td></tr>`,
    )
    .join("");

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
    <div style="background:#0A0A0B;padding:20px;text-align:center">
      <span style="color:#F26B21;font-size:28px;font-weight:800">ZAYA</span>
    </div>
    <div style="padding:24px;border:1px solid #eee;border-top:none">
      <h2 style="margin:0 0 4px">🛒 Nouvelle commande</h2>
      <p style="color:#666;margin:0 0 16px">Référence : <b>${order.reference}</b></p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="color:#666">Client</td><td style="text-align:right"><b>${order.customerName}</b></td></tr>
        <tr><td style="color:#666">Téléphone</td><td style="text-align:right"><b>${order.phone}</b></td></tr>
        <tr><td style="color:#666">Lieu</td><td style="text-align:right">${order.location}</td></tr>
        ${order.note ? `<tr><td style="color:#666">Note</td><td style="text-align:right">${order.note}</td></tr>` : ""}
      </table>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
      <table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
      <table style="width:100%;font-size:16px">
        <tr><td><b>TOTAL</b></td><td style="text-align:right;color:#F26B21"><b>${fmt(order.total)}</b></td></tr>
      </table>
      <p style="color:#999;font-size:12px;margin-top:20px">Connectez-vous à votre espace admin pour gérer cette commande.</p>
    </div>
  </div>`;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `🛒 Nouvelle commande ${order.reference} — ${fmt(order.total)}`,
        html,
      }),
    });
  } catch {
    // on n'interrompt jamais la commande à cause de l'email
  }
}

export async function sendDeliveryNotification(order: DeliveredOrderEmailData) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_EMAIL || "mouhammaddoums4@gmail.com";
  const from = process.env.EMAIL_FROM || "ZAYA <onboarding@resend.dev>";
  if (!key) return;

  const reference = escapeHtml(order.reference);
  const customerName = escapeHtml(order.customerName);
  const location = escapeHtml(order.location);
  const receivedBy = escapeHtml(order.receivedBy);
  const deliveredAt = escapeHtml(
    new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "Africa/Conakry",
    }).format(order.deliveredAt),
  );
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
    <div style="background:#0A0A0B;padding:20px;text-align:center">
      <span style="color:#F26B21;font-size:28px;font-weight:800">ZAYA</span>
    </div>
    <div style="padding:24px;border:1px solid #eee;border-top:none">
      <h2 style="margin:0 0 4px">Livraison effectuée</h2>
      <p style="color:#666;margin:0 0 16px">Commande : <b>${reference}</b></p>
      <p>La commande de <b>${customerName}</b> a été livrée à ${location}.</p>
      <p>Réceptionnée par : <b>${receivedBy}</b><br/>Le : ${deliveredAt}</p>
    </div>
  </div>`;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `Livraison effectuée — commande ${reference}`,
        html,
      }),
    });
  } catch {
    // Une erreur d'envoi ne doit pas annuler la livraison.
  }
}

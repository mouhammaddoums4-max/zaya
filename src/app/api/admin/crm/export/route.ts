import * as XLSX from "xlsx";
import { getCrmClients } from "@/lib/crm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SEG_LABEL: Record<string, string> = {
  VIP: "VIP",
  RECURRENT: "Récurrent",
  NOUVEAU: "Nouveau",
};

/** Exporte le carnet clients (CRM) en Excel. */
export async function GET() {
  const clients = await getCrmClients();

  const rows = clients.map((c) => ({
    nom: c.name,
    telephone: c.phone,
    localite: c.location,
    segment: SEG_LABEL[c.segment] ?? c.segment,
    commandes: c.orderCount,
    total_depense: c.totalSpent,
    premier_achat: c.firstOrder.toISOString().slice(0, 10),
    dernier_achat: c.lastOrder.toISOString().slice(0, 10),
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [
    { wch: 28 },
    { wch: 16 },
    { wch: 22 },
    { wch: 12 },
    { wch: 11 },
    { wch: 14 },
    { wch: 13 },
    { wch: 13 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Clients");
  const buf: Buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="zaya-clients-${new Date().toISOString().slice(0, 10)}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}

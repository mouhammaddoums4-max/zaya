import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Exporte le catalogue en fichier Excel (modèle de mise à jour du stock).
 * Colonnes : id | nom | marque | prix | stock
 * L'admin modifie la colonne « stock » (et/ou « prix ») puis réimporte.
 */
export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: [{ categoryId: "asc" }, { name: "asc" }],
    include: { category: { select: { name: true } } },
  });

  const rows = products.map((p) => ({
    id: p.id,
    nom: p.name,
    categorie: p.category?.name ?? "",
    marque: p.brand ?? "",
    prix: p.price,
    stock: p.stock,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [
    { wch: 26 },
    { wch: 40 },
    { wch: 22 },
    { wch: 16 },
    { wch: 12 },
    { wch: 10 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Stock");
  const buf: Buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="zaya-stock-${new Date().toISOString().slice(0, 10)}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}

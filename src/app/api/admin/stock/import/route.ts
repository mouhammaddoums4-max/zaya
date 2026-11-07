import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const norm = (s: string) =>
  s
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/** Récupère une valeur de ligne en testant plusieurs entêtes possibles. */
function pick(row: Record<string, unknown>, keys: string[]): unknown {
  const map = new Map<string, unknown>();
  for (const k of Object.keys(row)) map.set(norm(k), row[k]);
  for (const k of keys) {
    const v = map.get(k);
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return undefined;
}

const toInt = (v: unknown): number | null => {
  if (v === undefined || v === null || String(v).trim() === "") return null;
  const n = Math.round(Number(String(v).replace(/[^\d.-]/g, "")));
  return Number.isFinite(n) ? n : null;
};

export async function POST(req: Request) {
  let file: File | null = null;
  try {
    const form = await req.formData();
    file = form.get("file") as File | null;
  } catch {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }
  if (!file) {
    return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Fichier trop lourd (max 8 Mo)" }, { status: 400 });
  }

  let rows: Record<string, unknown>[];
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const wb = XLSX.read(buf, { type: "buffer" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  } catch {
    return NextResponse.json(
      { error: "Fichier illisible (Excel .xlsx/.xls ou CSV attendu)" },
      { status: 400 },
    );
  }

  if (!rows.length) {
    return NextResponse.json({ error: "Fichier vide" }, { status: 400 });
  }

  // Index des produits pour la correspondance
  const products = await prisma.product.findMany({
    select: { id: true, slug: true, name: true },
  });
  type ProdRef = (typeof products)[number];
  const byId = new Map<string, ProdRef>(products.map((p) => [p.id, p]));
  const bySlug = new Map<string, ProdRef>(products.map((p) => [norm(p.slug), p]));
  const byName = new Map<string, ProdRef>(products.map((p) => [norm(p.name), p]));

  let updated = 0;
  const notFound: string[] = [];
  const updates: { id: string; stock?: number; price?: number }[] = [];

  for (const row of rows) {
    const idRaw = pick(row, ["id", "identifiant"]);
    const slugRaw = pick(row, ["slug"]);
    const nameRaw = pick(row, ["nom", "name", "produit", "article"]);
    const stock = toInt(pick(row, ["stock", "quantite", "qte", "quantity", "qty"]));
    const price = toInt(pick(row, ["prix", "price", "prix de vente"]));

    if (stock === null && price === null) continue; // rien à mettre à jour

    const idKey = idRaw != null ? String(idRaw).trim() : "";
    const slugKey = slugRaw != null ? norm(String(slugRaw)) : "";
    const nameKey = nameRaw != null ? norm(String(nameRaw)) : "";
    const product =
      (idKey ? byId.get(idKey) : undefined) ??
      (slugKey ? bySlug.get(slugKey) : undefined) ??
      (nameKey ? byName.get(nameKey) : undefined);

    if (!product) {
      const label = String(nameRaw ?? idRaw ?? slugRaw ?? "ligne inconnue");
      if (notFound.length < 50) notFound.push(label);
      continue;
    }

    const data: { stock?: number; price?: number } = {};
    if (stock !== null) data.stock = Math.max(0, stock);
    if (price !== null && price > 0) data.price = price;
    updates.push({ id: product.id, ...data });
  }

  // Applique en transaction
  if (updates.length) {
    await prisma.$transaction(
      updates.map((u) =>
        prisma.product.update({
          where: { id: u.id },
          data: {
            ...(u.stock !== undefined ? { stock: u.stock } : {}),
            ...(u.price !== undefined ? { price: u.price } : {}),
          },
        }),
      ),
    );
    updated = updates.length;
  }

  return NextResponse.json({
    ok: true,
    updated,
    total: rows.length,
    notFoundCount: notFound.length,
    notFound: notFound.slice(0, 20),
  });
}

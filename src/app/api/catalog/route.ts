import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

function csvCell(v: string) {
  const s = (v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ");
  return `"${s}"`;
}

const CONDITION_MAP: Record<string, string> = {
  NEUF: "new",
  OCCASION: "used",
  RECONDITIONNE: "refurbished",
};

/**
 * Flux produit compatible Facebook / Instagram Shopping & Google Merchant.
 * À importer dans Facebook Commerce Manager (catalogue > source de données > flux planifié).
 */
export async function GET() {
  const base = SITE.url.replace(/\/$/, "");

  const products = await prisma.product
    .findMany({
      where: { active: true },
      include: { category: true },
    })
    .catch(() => []);

  const header = [
    "id",
    "title",
    "description",
    "availability",
    "condition",
    "price",
    "link",
    "image_link",
    "brand",
    "google_product_category",
    "product_type",
  ];

  const rows = products.map((p) => {
    const image = p.images[0] || "";
    const imageAbs = image.startsWith("http") ? image : `${base}${image}`;
    const desc = (p.description || p.name).slice(0, 5000);
    return [
      p.id,
      p.name,
      desc,
      p.stock > 0 ? "in stock" : "out of stock",
      CONDITION_MAP[p.condition] || "new",
      `${p.price} GNF`,
      `${base}/produit/${p.slug}`,
      imageAbs,
      p.brand || "ZAYA",
      "",
      p.category?.name || "",
    ]
      .map((c) => csvCell(String(c)))
      .join(",");
  });

  const csv = [header.map(csvCell).join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'inline; filename="zaya-catalogue.csv"',
      "Cache-Control": "public, max-age=1800",
    },
  });
}

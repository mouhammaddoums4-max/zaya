import StockImport from "@/components/admin/StockImport";

export const dynamic = "force-dynamic";

export default function AdminStockPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Gestion du stock</h1>
        <p className="text-sm text-ink-muted">
          Mettez à jour le stock de tous vos produits via un fichier Excel
        </p>
      </div>
      <StockImport />
    </div>
  );
}

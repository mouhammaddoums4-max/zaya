"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  Upload,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "@/components/Toaster";

type Result = {
  updated: number;
  total: number;
  notFoundCount: number;
  notFound: string[];
};

export default function StockImport() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const upload = async (file: File) => {
    setLoading(true);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/stock/import", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import échoué");
      setResult(data as Result);
      toast(`Stock mis à jour : ${data.updated} produit(s) ✅`);
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Étape 1 : modèle */}
      <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
        <h2 className="flex items-center gap-2 font-display font-bold">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zaya text-xs font-bold text-white">
            1
          </span>
          Télécharger le modèle Excel
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          Le fichier contient tous vos produits avec leur <b>stock</b> et{" "}
          <b>prix</b> actuels. Modifiez les colonnes <b>stock</b> (et{" "}
          <b>prix</b> si besoin), puis réimportez-le. Ne touchez pas à la
          colonne <b>id</b>.
        </p>
        <a
          href="/api/admin/stock/export"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink/90"
        >
          <Download className="h-4 w-4" />
          Télécharger le catalogue (.xlsx)
        </a>
      </section>

      {/* Étape 2 : import */}
      <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
        <h2 className="flex items-center gap-2 font-display font-bold">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zaya text-xs font-bold text-white">
            2
          </span>
          Importer le fichier mis à jour
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          Formats acceptés : Excel (.xlsx, .xls) ou CSV. Le stock de chaque
          produit sera remplacé par la valeur du fichier.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) {
              setFileName(f.name);
              upload(f);
            }
          }}
        />

        <button
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zaya/40 bg-zaya-50/40 py-8 text-center transition hover:border-zaya disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-7 w-7 animate-spin text-zaya" />
          ) : (
            <Upload className="h-7 w-7 text-zaya" />
          )}
          <span className="text-sm font-semibold text-zaya">
            {loading ? "Mise à jour en cours…" : "Choisir un fichier Excel"}
          </span>
          {fileName && !loading && (
            <span className="flex items-center gap-1 text-xs text-ink-muted">
              <FileSpreadsheet className="h-3.5 w-3.5" /> {fileName}
            </span>
          )}
        </button>
      </section>

      {/* Résultat */}
      {result && (
        <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
            <p className="font-semibold">
              {result.updated} produit(s) mis à jour sur {result.total} ligne(s)
            </p>
          </div>
          {result.notFoundCount > 0 && (
            <div className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
              <p className="flex items-center gap-1.5 font-semibold">
                <AlertTriangle className="h-4 w-4" />
                {result.notFoundCount} ligne(s) non reconnue(s) :
              </p>
              <ul className="mt-1 list-inside list-disc text-xs">
                {result.notFound.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs">
                Astuce : gardez la colonne <b>id</b> du modèle pour une
                correspondance fiable.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

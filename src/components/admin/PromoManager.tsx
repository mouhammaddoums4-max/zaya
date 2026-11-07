"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Ticket } from "lucide-react";
import { toast } from "@/components/Toaster";
import { formatNumber } from "@/lib/format";

type Promo = {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  minOrder: number;
  maxUses: number | null;
  used: number;
  active: boolean;
  expiresAt: string | null;
};

export default function PromoManager({ promos }: { promos: Promo[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    code: "",
    type: "PERCENT" as "PERCENT" | "FIXED",
    value: "",
    minOrder: "",
    maxUses: "",
    expiresAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim() || !form.value) {
      return toast("Code et valeur requis", "error");
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          type: form.type,
          value: Number(form.value),
          minOrder: form.minOrder ? Number(form.minOrder) : 0,
          maxUses: form.maxUses ? Number(form.maxUses) : null,
          expiresAt: form.expiresAt || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast("Code promo créé ✅");
      setForm({ code: "", type: "PERCENT", value: "", minOrder: "", maxUses: "", expiresAt: "" });
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (id: string, active: boolean) => {
    setBusy(id);
    try {
      await fetch(`/api/admin/promo/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  };

  const remove = async (id: string, code: string) => {
    if (!confirm(`Supprimer le code ${code} ?`)) return;
    setBusy(id);
    try {
      await fetch(`/api/admin/promo/${id}`, { method: "DELETE" });
      toast("Code supprimé");
      router.refresh();
    } finally {
      setBusy(null);
    }
  };

  const field =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-zaya focus:ring-2 focus:ring-zaya/20";
  const label = "mb-1.5 block text-sm font-medium";

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Création */}
      <form onSubmit={create} className="lg:col-span-1">
        <div className="sticky top-6 space-y-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
          <h2 className="font-display font-bold">Nouveau code</h2>
          <div>
            <label className={label}>Code</label>
            <input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className={`${field} uppercase`}
              placeholder="BIENVENUE10"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as "PERCENT" | "FIXED" })}
                className={field}
              >
                <option value="PERCENT">Pourcentage %</option>
                <option value="FIXED">Montant FG</option>
              </select>
            </div>
            <div>
              <label className={label}>{form.type === "PERCENT" ? "% remise" : "Montant"}</label>
              <input
                type="number"
                min={1}
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                className={field}
                placeholder={form.type === "PERCENT" ? "10" : "50000"}
              />
            </div>
          </div>
          <div>
            <label className={label}>Montant minimum (FG)</label>
            <input
              type="number"
              min={0}
              value={form.minOrder}
              onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
              className={field}
              placeholder="0"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Utilisations max</label>
              <input
                type="number"
                min={1}
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                className={field}
                placeholder="illimité"
              />
            </div>
            <div>
              <label className={label}>Expire le</label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className={field}
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><Plus className="h-4 w-4" /> Créer le code</>)}
          </button>
        </div>
      </form>

      {/* Liste */}
      <div className="lg:col-span-2">
        {promos.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-card ring-1 ring-black/5">
            <Ticket className="mx-auto h-10 w-10 text-ink-muted" />
            <p className="mt-3 text-ink-muted">Aucun code promo pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {promos.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zaya-50 text-zaya">
                  <Ticket className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold">{p.code}</span>
                    <span className="rounded-full bg-zaya-50 px-2 py-0.5 text-xs font-semibold text-zaya">
                      {p.type === "PERCENT" ? `-${p.value}%` : `-${formatNumber(p.value)} FG`}
                    </span>
                    {!p.active && (
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-ink-muted">
                        Inactif
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {p.minOrder > 0 && `Min. ${formatNumber(p.minOrder)} FG · `}
                    Utilisé {p.used}
                    {p.maxUses ? ` / ${p.maxUses}` : ""} fois
                    {p.expiresAt && ` · exp. ${new Date(p.expiresAt).toLocaleDateString("fr-FR")}`}
                  </p>
                </div>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={p.active}
                    disabled={busy === p.id}
                    onChange={(e) => toggle(p.id, e.target.checked)}
                    className="h-5 w-5 accent-zaya"
                  />
                </label>
                <button
                  onClick={() => remove(p.id, p.code)}
                  disabled={busy === p.id}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-red-50 hover:text-red-500"
                  aria-label="Supprimer"
                >
                  {busy === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

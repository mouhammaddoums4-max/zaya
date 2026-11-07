"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Bike, KeyRound, Phone } from "lucide-react";
import { toast } from "@/components/Toaster";

type Driver = {
  id: string;
  name: string;
  phone: string;
  active: boolean;
  deliveries: number;
};

export default function DriversManager({ drivers }: { drivers: Driver[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", pin: "" });
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const field =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-zaya focus:ring-2 focus:ring-zaya/20";

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !/^[0-9]{4,6}$/.test(form.pin)) {
      return toast("Nom, numéro et code PIN (4–6 chiffres) requis", "error");
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast("Livreur créé ✅");
      setForm({ name: "", phone: "", pin: "" });
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetPin = async (id: string) => {
    const pin = prompt("Nouveau code PIN (4 à 6 chiffres) :");
    if (!pin) return;
    if (!/^[0-9]{4,6}$/.test(pin)) return toast("PIN invalide", "error");
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/drivers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (!res.ok) throw new Error();
      toast("Code PIN mis à jour ✅");
    } catch {
      toast("Erreur", "error");
    } finally {
      setBusy(null);
    }
  };

  const toggle = async (id: string, active: boolean) => {
    setBusy(id);
    try {
      await fetch(`/api/admin/drivers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Supprimer le livreur ${name} ?`)) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/drivers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast("Livreur supprimé");
      router.refresh();
    } catch {
      toast("Suppression impossible", "error");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={create} className="lg:col-span-1">
        <div className="sticky top-6 space-y-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
          <h2 className="font-display font-bold">Nouveau livreur</h2>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} placeholder="Nom complet" />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} placeholder="Téléphone (ex. 620 00 00 00)" inputMode="tel" />
          <input value={form.pin} onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/[^0-9]/g, "") })} className={field} placeholder="Code PIN (4 à 6 chiffres)" inputMode="numeric" maxLength={6} />
          <p className="text-xs text-ink-muted">
            Le livreur se connecte sur <b>/livreur</b> avec son numéro et ce code PIN.
          </p>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><Plus className="h-4 w-4" /> Ajouter</>)}
          </button>
        </div>
      </form>

      <div className="space-y-3 lg:col-span-2">
        {drivers.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-card ring-1 ring-black/5">
            <Bike className="mx-auto h-10 w-10 text-ink-muted" />
            <p className="mt-3 text-ink-muted">Aucun livreur. Créez le premier !</p>
          </div>
        ) : (
          drivers.map((d) => (
            <div key={d.id} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zaya-50 text-zaya">
                <Bike className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {d.name}
                  {!d.active && <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-ink-muted">Inactif</span>}
                </p>
                <p className="flex items-center gap-1 text-xs text-ink-muted">
                  <Phone className="h-3 w-3" /> {d.phone} · {d.deliveries} livraison(s)
                </p>
              </div>
              <button onClick={() => resetPin(d.id)} disabled={busy === d.id} className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-zaya-50 hover:text-zaya" aria-label="Changer le PIN" title="Changer le code PIN">
                <KeyRound className="h-4 w-4" />
              </button>
              <label className="flex cursor-pointer items-center" title="Actif / inactif">
                <input type="checkbox" checked={d.active} disabled={busy === d.id} onChange={(e) => toggle(d.id, e.target.checked)} className="h-5 w-5 accent-zaya" />
              </label>
              <button onClick={() => remove(d.id, d.name)} disabled={busy === d.id} className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-red-50 hover:text-red-500" aria-label="Supprimer">
                {busy === d.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

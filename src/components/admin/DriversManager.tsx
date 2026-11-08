"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Plus,
  Trash2,
  Bike,
  KeyRound,
  Phone,
  Camera,
  CheckCircle2,
  Truck,
  Clock,
} from "lucide-react";
import SmartImage from "@/components/SmartImage";
import AdminImageUpload from "./AdminImageUpload";
import { compressImageFile } from "@/lib/imageCompress";
import { formatPrice } from "@/lib/format";
import { toast } from "@/components/Toaster";

type Driver = {
  id: string;
  name: string;
  phone: string;
  photo: string | null;
  active: boolean;
  assigned: number;
  delivered: number;
  inProgress: number;
  pending: number;
  revenue: number;
};

export default function DriversManager({ drivers }: { drivers: Driver[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", pin: "", photo: "" });
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const photoInputs = useRef<Record<string, HTMLInputElement | null>>({});

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
        body: JSON.stringify({ ...form, photo: form.photo || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast("Livreur créé ✅");
      setForm({ name: "", phone: "", pin: "", photo: "" });
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
    } finally {
      setLoading(false);
    }
  };

  const changePhoto = async (id: string, file: File) => {
    setBusy(id);
    try {
      const dataUrl = await compressImageFile(file, 600, 0.8);
      const res = await fetch(`/api/admin/drivers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo: dataUrl }),
      });
      if (!res.ok) throw new Error();
      toast("Photo mise à jour ✅");
      router.refresh();
    } catch {
      toast("Erreur photo", "error");
    } finally {
      setBusy(null);
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
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">
              Photo (optionnel)
            </label>
            <div className="w-32">
              <AdminImageUpload
                value={form.photo}
                onChange={(url) => setForm({ ...form, photo: url })}
                aspect="square"
                hint="Portrait"
              />
            </div>
          </div>
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
            <div key={d.id} className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5">
              <div className="flex items-center gap-3">
                {/* Avatar + changement photo */}
                <button
                  type="button"
                  onClick={() => photoInputs.current[d.id]?.click()}
                  disabled={busy === d.id}
                  className="group relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-zaya-50 ring-1 ring-black/5"
                  title="Changer la photo"
                >
                  {d.photo ? (
                    <SmartImage src={d.photo} alt={d.name} fill sizes="56px" className="object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-zaya">
                      <Bike className="h-6 w-6" />
                    </span>
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                    <Camera className="h-5 w-5 text-white" />
                  </span>
                </button>
                <input
                  ref={(el) => {
                    photoInputs.current[d.id] = el;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (f) changePhoto(d.id, f);
                  }}
                />

                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {d.name}
                    {!d.active && <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-ink-muted">Inactif</span>}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-ink-muted">
                    <Phone className="h-3 w-3" /> {d.phone}
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

              {/* Performance */}
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-black/5 pt-3 sm:grid-cols-4">
                <Stat icon={CheckCircle2} label="Livrées" value={d.delivered} tone="text-emerald-600" />
                <Stat icon={Truck} label="En cours" value={d.inProgress} tone="text-indigo-600" />
                <Stat icon={Clock} label="En attente" value={d.pending} tone="text-amber-600" />
                <Stat icon={Bike} label="CA livré" value={formatPrice(d.revenue)} tone="text-zaya" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  tone: string;
}) {
  return (
    <div className="rounded-xl bg-neutral-50 px-3 py-2">
      <p className={`flex items-center gap-1 text-sm font-bold ${tone}`}>
        <Icon className="h-4 w-4" /> {value}
      </p>
      <p className="text-[11px] text-ink-muted">{label}</p>
    </div>
  );
}

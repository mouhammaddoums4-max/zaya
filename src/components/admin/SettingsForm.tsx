"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Image as ImageIcon } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import { toast } from "@/components/Toaster";

type Settings = {
  popupEnabled: boolean;
  popupImage: string;
  popupLink: string;
  popupTitle: string;
  announcement: string;
};

export default function SettingsForm({ initial }: { initial: Settings }) {
  const router = useRouter();
  const [form, setForm] = useState<Settings>(initial);
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          popupEnabled: form.popupEnabled,
          popupImage: form.popupImage || null,
          popupLink: form.popupLink || null,
          popupTitle: form.popupTitle || null,
          announcement: form.announcement || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast("Paramètres enregistrés ✅");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
    } finally {
      setLoading(false);
    }
  };

  const field =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-zaya focus:ring-2 focus:ring-zaya/20";
  const label = "mb-1.5 block text-sm font-medium text-ink";

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
          <h2 className="mb-1 font-display font-bold">Popup publicitaire</h2>
          <p className="mb-4 text-xs text-ink-muted">
            Affiche une image promotionnelle au centre de l'écran à l'arrivée des
            visiteurs. Idéal pour une promo ou une annonce.
          </p>

          <label className="mb-4 flex cursor-pointer items-center justify-between rounded-xl bg-neutral-50 px-4 py-3">
            <span className="text-sm font-medium">Activer le popup</span>
            <input
              type="checkbox"
              checked={form.popupEnabled}
              onChange={(e) => set("popupEnabled", e.target.checked)}
              className="h-5 w-5 accent-zaya"
            />
          </label>

          <div className="space-y-4">
            <div>
              <label className={label}>URL de l'image *</label>
              <input
                value={form.popupImage}
                onChange={(e) => set("popupImage", e.target.value)}
                className={field}
                placeholder="https://exemple.com/promo.jpg"
              />
            </div>
            <div>
              <label className={label}>Lien au clic (optionnel)</label>
              <input
                value={form.popupLink}
                onChange={(e) => set("popupLink", e.target.value)}
                className={field}
                placeholder="/boutique?filtre=promo"
              />
            </div>
            <div>
              <label className={label}>Titre sous l'image (optionnel)</label>
              <input
                value={form.popupTitle}
                onChange={(e) => set("popupTitle", e.target.value)}
                className={field}
                placeholder="Grande promo de la semaine !"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
          <h2 className="mb-1 font-display font-bold">Bandeau d'annonce</h2>
          <p className="mb-4 text-xs text-ink-muted">
            Court message affiché en haut du site (optionnel).
          </p>
          <input
            value={form.announcement}
            onChange={(e) => set("announcement", e.target.value)}
            className={field}
            placeholder="Livraison offerte dès 1 000 000 FG !"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
        </button>
      </div>

      {/* Aperçu */}
      <div>
        <div className="sticky top-6 rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
          <h3 className="mb-3 font-display font-bold">Aperçu du popup</h3>
          {form.popupEnabled && form.popupImage ? (
            <div className="overflow-hidden rounded-xl ring-1 ring-black/5">
              <div className="relative aspect-[3/4] w-full bg-neutral-50">
                <SmartImage src={form.popupImage} alt="Aperçu" fill sizes="300px" className="object-cover" />
              </div>
              {form.popupTitle && (
                <div className="p-3 text-center">
                  <p className="font-display font-bold">{form.popupTitle}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-black/10 py-10 text-ink-muted">
              <ImageIcon className="h-8 w-8" />
              <p className="text-center text-xs">
                {form.popupEnabled ? "Ajoutez une URL d'image" : "Popup désactivé"}
              </p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

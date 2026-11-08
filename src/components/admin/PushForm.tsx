"use client";

import { useState } from "react";
import { Loader2, Send, Bell } from "lucide-react";
import { toast } from "@/components/Toaster";

export default function PushForm({ subscribers }: { subscribers: number }) {
  const [form, setForm] = useState({ title: "", body: "", url: "/boutique" });
  const [loading, setLoading] = useState(false);

  const field =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-zaya focus:ring-2 focus:ring-zaya/20";

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.title.trim().length < 2) return toast("Titre requis", "error");
    if (!confirm(`Envoyer cette notification à ${subscribers} abonné(s) ?`)) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast(`Envoyé à ${data.sent} appareil(s) ✅`);
      setForm({ title: "", body: "", url: "/boutique" });
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={send} className="space-y-4 lg:col-span-2">
        <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
          <h2 className="mb-4 font-display font-bold">Nouvelle notification push</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Titre</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={field} placeholder="🔥 Grande promo ce week-end !" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Message</label>
              <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={3} className={`${field} resize-none`} placeholder="Jusqu'à -50% sur une sélection. Profitez-en !" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Lien au clic</label>
              <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={field} placeholder="/boutique?filtre=promo" />
            </div>
          </div>
          <button type="submit" disabled={loading || subscribers === 0} className="btn-primary mt-5">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><Send className="h-4 w-4" /> Envoyer à {subscribers} abonné(s)</>)}
          </button>
        </div>
      </form>

      <div>
        <div className="rounded-2xl bg-white p-5 text-center shadow-card ring-1 ring-black/5">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zaya-50 text-zaya">
            <Bell className="h-6 w-6" />
          </span>
          <p className="mt-3 font-display text-3xl font-bold">{subscribers}</p>
          <p className="text-sm text-ink-muted">Abonné(s) aux notifications</p>
        </div>
      </div>
    </div>
  );
}

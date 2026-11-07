"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import AdminImageUpload from "./AdminImageUpload";
import { toast } from "@/components/Toaster";

type Slide = { image: string; title: string; subtitle: string; cta: string; link: string };
type Ad = { image: string; link: string };

export default function ContentManager({
  initialSlides,
  initialBanners,
  initialAds,
}: {
  initialSlides: Slide[];
  initialBanners: Slide[];
  initialAds: Ad[];
}) {
  const router = useRouter();
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [banners, setBanners] = useState<Slide[]>(initialBanners);
  const [ads, setAds] = useState<Ad[]>(initialAds);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slides: slides.filter((s) => s.image),
          banners: banners.filter((b) => b.image),
          squareAds: ads.filter((a) => a.image),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast("Contenu enregistré ✅");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
    } finally {
      setLoading(false);
    }
  };

  const field =
    "w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-zaya focus:ring-2 focus:ring-zaya/20";

  return (
    <div className="space-y-8 pb-24">
      {/* Carrousel */}
      <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-display font-bold">Carrousel d'accueil</h2>
          <button
            onClick={() =>
              setSlides([...slides, { image: "", title: "", subtitle: "", cta: "", link: "" }])
            }
            className="flex items-center gap-1 rounded-lg bg-zaya px-3 py-1.5 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </div>
        <p className="mb-4 text-xs text-ink-muted">
          Images paysage recommandées : <b>≈ 1400 × 420 px</b> (ratio large).
        </p>
        {slides.length === 0 && (
          <p className="rounded-lg bg-neutral-50 px-3 py-4 text-center text-sm text-ink-muted">
            Aucune diapositive — le carrousel par défaut sera utilisé.
          </p>
        )}
        <div className="space-y-4">
          {slides.map((s, i) => (
            <div key={i} className="grid gap-3 rounded-xl bg-neutral-50 p-3 md:grid-cols-[200px_1fr]">
              <AdminImageUpload
                value={s.image}
                onChange={(url) =>
                  setSlides(slides.map((x, idx) => (idx === i ? { ...x, image: url } : x)))
                }
                aspect="wide"
                hint="≈ 1400 × 420 px"
              />
              <div className="space-y-2">
                <input
                  value={s.title}
                  onChange={(e) => setSlides(slides.map((x, idx) => (idx === i ? { ...x, title: e.target.value } : x)))}
                  placeholder="Titre (ex. Achetez malin.)"
                  className={field}
                />
                <input
                  value={s.subtitle}
                  onChange={(e) => setSlides(slides.map((x, idx) => (idx === i ? { ...x, subtitle: e.target.value } : x)))}
                  placeholder="Sous-titre"
                  className={field}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={s.cta}
                    onChange={(e) => setSlides(slides.map((x, idx) => (idx === i ? { ...x, cta: e.target.value } : x)))}
                    placeholder="Bouton (ex. Découvrir)"
                    className={field}
                  />
                  <input
                    value={s.link}
                    onChange={(e) => setSlides(slides.map((x, idx) => (idx === i ? { ...x, link: e.target.value } : x)))}
                    placeholder="Lien (ex. /boutique)"
                    className={field}
                  />
                </div>
                <button
                  onClick={() => setSlides(slides.filter((_, idx) => idx !== i))}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Supprimer cette diapositive
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bandeaux */}
      <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-display font-bold">Bandeaux promos (3 recommandés)</h2>
          <button
            onClick={() => setBanners([...banners, { image: "", title: "", subtitle: "", cta: "", link: "" }])}
            className="flex items-center gap-1 rounded-lg bg-zaya px-3 py-1.5 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </div>
        <p className="mb-4 text-xs text-ink-muted">
          Images recommandées : <b>≈ 600 × 300 px</b> (ratio 2:1). Laissez vide pour le design par défaut.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {banners.map((b, i) => (
            <div key={i} className="space-y-2 rounded-xl bg-neutral-50 p-3">
              <AdminImageUpload
                value={b.image}
                onChange={(url) => setBanners(banners.map((x, idx) => (idx === i ? { ...x, image: url } : x)))}
                aspect="banner"
                hint="≈ 600 × 300 px"
              />
              <input value={b.title} onChange={(e) => setBanners(banners.map((x, idx) => (idx === i ? { ...x, title: e.target.value } : x)))} placeholder="Titre" className={field} />
              <input value={b.cta} onChange={(e) => setBanners(banners.map((x, idx) => (idx === i ? { ...x, cta: e.target.value } : x)))} placeholder="Bouton" className={field} />
              <input value={b.link} onChange={(e) => setBanners(banners.map((x, idx) => (idx === i ? { ...x, link: e.target.value } : x)))} placeholder="Lien" className={field} />
              <button onClick={() => setBanners(banners.filter((_, idx) => idx !== i))} className="flex items-center gap-1 text-xs text-red-500">
                <Trash2 className="h-3.5 w-3.5" /> Supprimer
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Pubs carrées */}
      <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-display font-bold">Bannières pub carrées</h2>
          <button
            onClick={() => setAds([...ads, { image: "", link: "" }])}
            className="flex items-center gap-1 rounded-lg bg-zaya px-3 py-1.5 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </div>
        <p className="mb-4 text-xs text-ink-muted">
          Insérées automatiquement dans les grilles (accueil + catégories). Image <b>carrée ≈ 600 × 600 px</b>.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {ads.map((a, i) => (
            <div key={i} className="space-y-2 rounded-xl bg-neutral-50 p-3">
              <AdminImageUpload
                value={a.image}
                onChange={(url) => setAds(ads.map((x, idx) => (idx === i ? { ...x, image: url } : x)))}
                aspect="square"
                hint="600 × 600 px"
              />
              <input value={a.link} onChange={(e) => setAds(ads.map((x, idx) => (idx === i ? { ...x, link: e.target.value } : x)))} placeholder="Lien" className={field} />
              <button onClick={() => setAds(ads.filter((_, idx) => idx !== i))} className="flex items-center gap-1 text-xs text-red-500">
                <Trash2 className="h-3.5 w-3.5" /> Supprimer
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Barre d'enregistrement */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/5 bg-white/95 p-3 pb-24 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-end gap-3 px-2">
          <button onClick={save} disabled={loading} className="btn-primary">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer le contenu"}
          </button>
        </div>
      </div>
    </div>
  );
}

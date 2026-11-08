import Link from "next/link";
import { Palette, ChevronRight } from "lucide-react";
import { getSettings } from "@/lib/data";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const s = await getSettings();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Paramètres</h1>
        <p className="text-sm text-ink-muted">
          Popup publicitaire, annonces et apparence du site
        </p>
      </div>

      {/* Accès Apparence (carrousel, bannières, pubs) */}
      <Link
        href="/admin/apparence"
        className="mb-6 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5 transition hover:ring-zaya"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zaya-50 text-zaya">
          <Palette className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="font-semibold">Apparence</p>
          <p className="text-sm text-ink-muted">
            Carrousel, bannières promos et bannières publicitaires
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-ink-muted" />
      </Link>

      <SettingsForm
        initial={{
          popupEnabled: s.popupEnabled,
          popupImage: s.popupImage ?? "",
          popupLink: s.popupLink ?? "",
          popupTitle: s.popupTitle ?? "",
          announcement: s.announcement ?? "",
        }}
      />
    </div>
  );
}

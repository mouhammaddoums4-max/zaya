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
          Popup publicitaire et annonces du site
        </p>
      </div>
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

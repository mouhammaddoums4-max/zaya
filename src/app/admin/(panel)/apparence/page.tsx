import { getSettings } from "@/lib/data";
import ContentManager from "@/components/admin/ContentManager";

export const dynamic = "force-dynamic";

export default async function AdminAppearancePage() {
  const s = await getSettings();

  const slides = s.slides.map((x) => ({
    image: x.image,
    title: x.title ?? "",
    subtitle: x.subtitle ?? "",
    cta: x.cta ?? "",
    link: x.link ?? "",
  }));
  const banners = s.banners.map((x) => ({
    image: x.image,
    title: x.title ?? "",
    subtitle: x.subtitle ?? "",
    cta: x.cta ?? "",
    link: x.link ?? "",
  }));
  const ads = s.squareAds.map((x) => ({ image: x.image, link: x.link ?? "" }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Apparence & contenu</h1>
        <p className="text-sm text-ink-muted">
          Carrousel, bandeaux promos et bannières publicitaires
        </p>
      </div>
      <ContentManager
        initialLogo={s.logo}
        initialSlides={slides}
        initialBanners={banners}
        initialAds={ads}
      />
    </div>
  );
}

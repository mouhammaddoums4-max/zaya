import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";
import CookieConsent from "@/components/CookieConsent";
import PopupAd from "@/components/PopupAd";
import QuickViewModal from "@/components/QuickViewModal";
import PushOptIn from "@/components/PushOptIn";
import { getSettings } from "@/lib/data";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <>
      <Suspense fallback={<div className="h-16 bg-white md:h-28 lg:h-36" />}>
        <Header />
      </Suspense>
      <main className="min-h-[60vh] pb-20 md:pb-0">{children}</main>
      <Footer />
      <CartDrawer />
      <QuickViewModal />
      <MobileBottomNav />
      <CookieConsent />
      <PushOptIn />
      <PopupAd
        enabled={settings.popupEnabled}
        image={settings.popupImage}
        link={settings.popupLink}
        title={settings.popupTitle}
      />
    </>
  );
}

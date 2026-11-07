import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE } from "@/lib/constants";
import { Toaster } from "@/components/Toaster";

// Fonts self-hosted (next/font/local) to avoid build-time fetches to
// Google Fonts, which fail intermittently on Vercel.
const inter = localFont({
  src: "./fonts/Inter-latin.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "100 900",
});

const sora = localFont({
  src: "./fonts/Sora-latin.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "100 800",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "ZAYA",
    "e-commerce Guinée",
    "shopping en ligne Guinée",
    "acheter en ligne Conakry",
    "téléphones Guinée",
    "mode Guinée",
    "livraison Conakry",
    "GNF",
  ],
  authors: [{ name: "ZAYA" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  icons: {
    icon: [{ url: "/logo-zaya.png" }],
    apple: [{ url: "/logo-zaya.png" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${sora.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

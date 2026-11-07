import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "ZAYA — Marketplace en ligne en Guinée";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A0A0B 0%, #1A1A1D 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 150,
            fontWeight: 800,
            letterSpacing: -4,
            color: "#F26B21",
          }}
        >
          ZAYA
        </div>
        <div style={{ fontSize: 40, marginTop: 10, color: "white" }}>
          Achetez malin. Vendez facilement.
        </div>
        <div style={{ fontSize: 28, marginTop: 24, color: "#9A9AA2" }}>
          {SITE.tagline}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            padding: "14px 36px",
            background: "#F26B21",
            borderRadius: 999,
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          🛍️ Livraison partout en Guinée · Paiement à la livraison
        </div>
      </div>
    ),
    { ...size },
  );
}

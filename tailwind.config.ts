import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        zaya: {
          DEFAULT: "#F26B21",
          50: "#FFF3EB",
          100: "#FFE2CC",
          200: "#FFC199",
          300: "#FF9F66",
          400: "#FF8A3D",
          500: "#F26B21",
          600: "#D4530F",
          700: "#A63F0B",
          800: "#7A2E08",
          900: "#4D1D05",
        },
        ink: {
          DEFAULT: "#0A0A0B",
          soft: "#141416",
          card: "#1A1A1D",
          line: "#2A2A2F",
          muted: "#8A8A92",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(242, 107, 33, 0.45)",
        card: "0 8px 30px -12px rgba(0, 0, 0, 0.5)",
      },
      keyframes: {
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "marquee": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 28s linear infinite",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

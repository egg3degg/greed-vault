import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vaultBg: "#0B0F19",
        vaultPanel: "#141C2E",
        vaultPanelHover: "#1A253D",
        vaultBorder: "#27354E",
        goldAccent: "#FFD700",
        goldGlow: "rgba(255, 215, 0, 0.35)",
        emeraldWin: "#00F092",
        emeraldGlow: "rgba(0, 240, 146, 0.35)",
        crimsonBust: "#FF3344",
        textMuted: "#94A3B8",
        textLight: "#F8FAFC",
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      animation: {
        pulseSlow: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glint: "glint 2s ease-in-out infinite",
      },
      keyframes: {
        glint: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // ── Liquid glass surface palette (light) ──
        surface: {
          0: "#ffffff",
          50: "#fbfcfe",
          100: "#f5f7fb",
          200: "#eaeef6",
          300: "#dbe2ee",
          400: "#c5cee0",
          500: "#94a3b8",
          600: "#64748b",
          700: "#475569",
          800: "#1e293b",
          900: "#0f172a",
        },
        ink: {
          DEFAULT: "#0f172a",
          soft: "#1e293b",
          muted: "#475569",
          subtle: "#64748b",
          faint: "#94a3b8",
        },
        accent: {
          DEFAULT: "#6366f1", // indigo-500
          light: "#818cf8",
          soft: "#a5b4fc",
          dark: "#4f46e5",
          ice: "#0ea5e9",
        },
        steam: {
          blue: "#0ea5e9",
          green: "#16a34a",
          gold: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "lb-soft": "0 1px 0 rgba(255,255,255,0.85) inset, 0 12px 30px -16px rgba(15,23,42,0.18)",
        "lb-glass": "0 1px 0 rgba(255,255,255,0.85) inset, 0 24px 60px -28px rgba(15,23,42,0.28), 0 8px 24px -16px rgba(99,102,241,0.18)",
        "lb-pop": "0 1px 0 rgba(255,255,255,0.9) inset, 0 28px 70px -20px rgba(15,23,42,0.30), 0 14px 30px -18px rgba(99,102,241,0.30)",
        "lb-button": "0 1px 0 rgba(255,255,255,0.65) inset, 0 10px 24px -10px rgba(99,102,241,0.45)",
      },
      animation: {
        "progress-fill": "progressFill 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-up": "fadeInUp 0.7s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "shimmer": "shimmer 2.4s infinite linear",
        "lb-float": "lbFloat 14s ease-in-out infinite alternate",
      },
      keyframes: {
        progressFill: {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        lbFloat: {
          "0%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(20px,-30px,0) scale(1.04)" },
          "100%": { transform: "translate3d(-15px,15px,0) scale(0.98)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

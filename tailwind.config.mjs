/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        surface: {
          50: "#f0f2f5",
          100: "#d1d5db",
          200: "#9ca3af",
          300: "#6b7280",
          400: "#374151",
          500: "#1f2937",
          600: "#192030",
          700: "#131a27",
          800: "#0d1117",
          900: "#080b10",
        },
        accent: {
          DEFAULT: "#6d5dfc",
          light: "#8b7eff",
          dark: "#5243d9",
        },
        steam: {
          blue: "#1b9aaa",
          green: "#4ade80",
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
      animation: {
        "progress-fill": "progressFill 1.5s ease-out forwards",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        shimmer: "shimmer 2s infinite linear",
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
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

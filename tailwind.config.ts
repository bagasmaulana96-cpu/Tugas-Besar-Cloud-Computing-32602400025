import type { Config } from "tailwindcss";

// Dark-mode values (default theme). Light mode overrides are handled via CSS variables in globals.css and `dark:` prefixes, not here.
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-base": "#0a0a0a",
        "bg-surface": "#0f0f0f",
        "bg-card": "#111111",
        "bg-hover": "#161616",
        "bg-border": "#1e1e1e",
        "bg-border2": "#141414",
        "purple-dim": "#1a0d2e",
        "purple-mid": "#2d1b4e",
        "purple-main": "#7c3aed",
        "purple-light": "#a855f7",
        "purple-glow": "#c084fc",
        "green-main": "#22c55e",
        "blue-main": "#60a5fa",
        "amber-main": "#f59e0b",
        "red-main": "#f87171",
        "text-primary": "#f0f0f0",
        "text-secondary": "#888888",
        "text-muted": "#444444",
        "text-faint": "#2a2a2a",
      },

      // Font families use CSS variables provided by next/font/google in app/layout.tsx.
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },

      borderRadius: {
        card: "16px",
        xl2: "20px",
      },

      backdropBlur: {
        md: "12px",
        xl: "24px",
      },

      // Usage: set inline style `--exp-width: 65%` on the progress bar fill element, then apply the `animate-exp-fill` class.
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "exp-fill": {
          "0%": { width: "0%" },
          "100%": { width: "var(--exp-width, 100%)" },
        },
        "level-up": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.06)" },
          "100%": { transform: "scale(1)" },
        },
        "glow-pulse": {
          "0%": { boxShadow: "0 0 0px #c084fc" },
          "50%": { boxShadow: "0 0 12px #c084fc" },
          "100%": { boxShadow: "0 0 0px #c084fc" },
        },
      },

      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "exp-fill": "exp-fill 0.6s ease-out",
        "level-up": "level-up 0.5s ease-out",
        "glow-pulse": "glow-pulse 2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;

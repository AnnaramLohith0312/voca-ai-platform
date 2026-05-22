import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        headline: ["Clash Display", "Space Grotesk", "sans-serif"],
        display: ["Clash Display", "Space Grotesk", "sans-serif"],
        body: ["Satoshi", "Inter", "sans-serif"],
        label: ["Satoshi", "Inter", "sans-serif"],
      },
      colors: {
        // ── shadcn / Radix compatibility ─────────────────────────
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        insight: {
          DEFAULT: "hsl(var(--insight))",
          foreground: "hsl(var(--insight-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        // ── VOCA Design System (exact from Stitch) ───────────────
        // Backgrounds
        "voca-bg": "#0b0e12",
        "voca-surface": "#13161b",
        "voca-surface-2": "#171c24",
        "voca-surface-3": "#1f2530",

        // Surface scale (from design tokens)
        "surface-lowest": "#0b0e12",
        "surface-low": "#191c20",
        "surface-container": "#1d2024",
        "surface-container-high": "#272a2f",
        "surface-container-highest": "#323539",
        "surface-variant": "#323539",
        "surface-bright": "#36393e",

        // Text
        "on-surface": "#e1e2e8",
        "on-surface-variant": "#bcc9c8",
        "on-surface-muted": "#8b95a7",
        "on-surface-faint": "#576073",
        "text-primary": "#edf1f7",

        // Brand colors
        "brand-teal": "#0ea5a0",
        "brand-teal-hover": "#0d9390",
        "brand-teal-active": "#0a7d79",
        "brand-teal-glow": "rgba(14,165,160,0.15)",
        "brand-teal-dim": "rgba(14,165,160,0.08)",

        "brand-gold": "#c99a43",
        "brand-gold-hover": "#b8832c",
        "brand-gold-dim": "rgba(201,154,67,0.10)",

        "brand-red": "#d96a6a",
        "brand-red-dim": "rgba(217,106,106,0.10)",

        // Primary (teal) scale from Stitch
        "voca-primary": "#5ed9d3",
        "voca-primary-container": "#0ea5a0",
        "voca-on-primary": "#003735",
        "voca-on-primary-container": "#003331",

        // Gold (secondary) scale
        "voca-secondary": "#f1be63",
        "voca-secondary-container": "#805a00",

        // Border
        "border-subtle": "rgba(255,255,255,0.08)",
        "outline-variant": "#3d4948",

        // Match score
        "match-gold": "#c9933a",
        "match-gold-bg": "rgba(201,147,58,0.10)",
        "match-gold-border": "rgba(201,147,58,0.30)",

        // Input
        "input-bg": "#20252f",
        "card-auth": "#1a1e26",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        pill: "9999px",
        card: "24px",
        "voca-card": "12px",
        "voca-lg": "16px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        orbit: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "message-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "flow-line": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "reveal-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(14,165,160,0.1)" },
          "50%": { boxShadow: "0 0 40px rgba(14,165,160,0.25)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "orbit-slow": "orbit 60s linear infinite",
        "message-in": "message-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "flow-line": "flow-line 20s linear infinite",
        "reveal-up": "reveal-up 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        "pulse-slow": "pulse-slow 4s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

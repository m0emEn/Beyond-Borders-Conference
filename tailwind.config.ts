import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1A1F5E",
          light: "#2D3494",
        },
        accent: {
          purple: "#7C3AED",
          violet: "#6D28D9",
          pink: "#DB2777",
          teal: "#0D9488",
          amber: "#F59E0B",
        },
        surface: {
          1: "#111232",
          2: "#191B3A",
          3: "#1E2147",
        },
        bg: "#0A0B1E",
        "text-primary": "#F0F1FF",
        "text-secondary": "#9BA3EB",
        "text-muted": "#5B6399",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "20px",
        xl: "32px",
      },
      boxShadow: {
        "glow-purple": "0 0 40px rgba(124, 58, 237, 0.3)",
        "glow-pink": "0 0 40px rgba(219, 39, 119, 0.3)",
        card: "0 8px 32px rgba(0, 0, 0, 0.4)",
      },
      backgroundImage: {
        "gradient-hero":
          "linear-gradient(135deg, #1A1F5E 0%, #7C3AED 50%, #DB2777 100%)",
        "gradient-cta": "linear-gradient(90deg, #7C3AED, #DB2777)",
        "gradient-card":
          "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(219,39,119,0.15))",
      },
    },
  },
  plugins: [],
};

export default config;

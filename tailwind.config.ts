import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      colors: {
        background: "#0C0A09", // Stone 950
        foreground: "#FAFAF9", // Stone 50
        stone: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917",
          950: "#0C0A09",
        },
        rose: {
          500: "#F43F5E",
          600: "#E11D48", // Darker rose for hover
        },
        amber: {
          100: "#FEF3C7", // Soft Amber
        },
        card: {
          DEFAULT: "#1C1917", // Stone 900
          foreground: "#FAFAF9",
        },
        popover: {
          DEFAULT: "#1C1917",
          foreground: "#FAFAF9",
        },
        primary: {
          DEFAULT: "#F43F5E", // Rose 500
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#292524", // Stone 800
          foreground: "#FAFAF9",
        },
        muted: {
          DEFAULT: "#292524",
          foreground: "#A8A29E", // Stone 400
        },
        accent: {
          DEFAULT: "#292524",
          foreground: "#FAFAF9",
        },
        destructive: {
          DEFAULT: "#7F1D1D", // Red 900
          foreground: "#FAFAF9",
        },
        border: "#292524", // Stone 800
        input: "#292524",
        ring: "#F43F5E",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        'soft-fade': 'fadeIn 1.2s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

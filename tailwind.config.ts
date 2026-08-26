import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          maroon: {
            50: "#FDF2F4",
            100: "#FCE7EA",
            200: "#F8D0D7",
            300: "#F1A4B2",
            400: "#E3627A",
            500: "#B91C37",
            600: "#99142D",
            700: "#7B1123", // Primary Maroon
            800: "#670E1D",
            900: "#520B17",
            DEFAULT: "#7B1123",
          },
          saffron: {
            50: "#FFFBEB",
            100: "#FEF3C7",
            200: "#FDE68A",
            300: "#FCD34D",
            400: "#FBBF24",
            500: "#D97706", // Muted Saffron / Warm Orange
            600: "#C25E00",
            700: "#B45309",
            800: "#92400E",
            900: "#78350F",
            DEFAULT: "#D97706",
          },
          ivory: {
            50: "#FDFBF7",
            100: "#FAF8F5", // Warm Off-White body background
            200: "#F4EFEA",
            300: "#EAE2D9",
            400: "#D3C6B6",
            DEFAULT: "#FAF8F5",
          },
          charcoal: {
            50: "#F9FAFB",
            100: "#F3F4F6",
            500: "#6B7280",
            600: "#52525B", // Secondary text
            700: "#374151",
            800: "#1F2937", // Main body text
            900: "#111827", // Heading text
            DEFAULT: "#1F2937",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
    },
  },
  plugins: [],
};

export default config;

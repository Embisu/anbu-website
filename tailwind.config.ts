import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ANBU brand
        navy: {
          DEFAULT: "#012f87",
          50: "#eef3fb",
          100: "#d5e1f4",
          200: "#a7bfe6",
          300: "#7699d6",
          400: "#3f66be",
          500: "#1a44a1",
          600: "#012f87",
          700: "#01276f",
          800: "#021d52",
          900: "#03163d",
          950: "#020c22",
        },
        orange: {
          DEFAULT: "#f5501e",
          50: "#fff2ec",
          100: "#ffdccd",
          200: "#ffb59b",
          300: "#ff8a63",
          400: "#fb6a3b",
          500: "#f5501e",
          600: "#d63c11",
          700: "#b02d0d",
          800: "#8a2510",
          900: "#6f2211",
        },
        ink: "#0b1220",
        cloud: "#f6f8fc",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        marquee: "marquee 28s linear infinite",
        "marquee-slow": "marquee 60s linear infinite",
        "marquee-rev": "marquee 52s linear infinite reverse",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 18s linear infinite",
        "spin-rev": "spin 26s linear infinite reverse",
      },
    },
  },
  plugins: [],
};

export default config;

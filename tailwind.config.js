/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom color palette from Design Document
        slate: "#303a47", // Primary / Strong state
        terracotta: "#755556", // Error / Weak state
        orange: "#e48037", // Warning / Fair state
        stone: "#e9e4e1", // Surface / Input background
        cloud: "#f4f5f6", // Background
      },
      fontFamily: {
        sans: ["Inter", "DM Sans", "sans-serif"],
      },
      borderRadius: {
        xl: "16px", // Custom border radius for cards
      },
      fontSize: {
        // Custom typography scale
        logo: [
          "24px",
          { lineHeight: "1.2", letterSpacing: "-0.5px", fontWeight: "700" },
        ],
        input: ["32px", { lineHeight: "1.2", fontWeight: "500" }],
        label: [
          "12px",
          {
            lineHeight: "1.4",
            letterSpacing: "1px",
            fontWeight: "400",
            textTransform: "uppercase",
          },
        ],
        body: ["16px", { lineHeight: "1.5", fontWeight: "400" }],
      },
      spacing: {
        // Custom spacing for input height
        20: "80px",
      },
    },
  },
  plugins: [],
};

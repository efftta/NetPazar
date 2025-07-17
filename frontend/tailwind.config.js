/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class", // Tema değişimi için bu önemli
  theme: {
    extend: {
      colors: {
        // Mevcut renkleriniz korunuyor
        primary: "#1d4ed8",
        secondary: "#9333ea",
        accent: "#f59e0b",
        success: "#10b981",
        danger: "#ef4444",
        muted: "#6b7280",
      },
      fontFamily: {
        // Mevcut font tanımınız korunuyor
        sans: ["Inter", "Arial", "sans-serif"],
      },
      boxShadow: {
        // Modern UI için hafif gölgeler eklendi
        'custom-light': '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        'custom-medium': '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/container-queries"),
  ],
};
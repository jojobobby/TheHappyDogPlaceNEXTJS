/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          dark: "var(--secondary-dark)",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          bg: "var(--card-bg)",
          border: "var(--card-border)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
        link: "var(--link)",
        button: {
          bg: "var(--button-bg)",
          text: "var(--button-text)",
        },
        border: "var(--border)",
      },
    },
  },
  darkMode: 'class', // Enable dark mode
  plugins: [],
};
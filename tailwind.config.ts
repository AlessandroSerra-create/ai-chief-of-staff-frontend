import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B5BF6",
        "primary-light": "#EEF1FF",
        "sidebar-bg": "#FFFFFF",
        "page-bg": "#F5F6FA",
      },
    },
  },
  plugins: [],
};
export default config;

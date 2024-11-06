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
       background: "var(--background)",
       foreground: "var(--foreground)",
       primary: {
         DEFAULT: "var(--primary)",
         foreground: "var(--primary-foreground)",
       },
       secondary: {
         DEFAULT: "var(--secondary)",
         foreground: "var(--secondary-foreground)",
       },
     },
     spacing: {
       'safe': 'env(safe-area-inset-bottom)',
     },
   },
 },
 plugins: [],
};

export default config;
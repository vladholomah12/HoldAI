import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "HoldAI - TON Mini App",
  description: "Earn and manage your TON tokens",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-gray-900`}>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <Script 
          id="telegram-webapp"
          src="/scripts/telegram-web-app.js" 
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
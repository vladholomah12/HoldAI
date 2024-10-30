import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import type { ReactNode } from 'react';

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
}: {
  children: ReactNode;
}) {
  return (
    <html lang="uk">
      <head>
        <title>HoldAI - TON Mini App</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <Script
          id="telegram-webapp"
          src="/scripts/telegram-web-app.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import { TelegramProvider } from '@/providers/telegram-provider'

export const metadata: Metadata = {
  title: 'Hold AI',
  description: 'Telegram Mini App for Hold AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body suppressHydrationWarning>
        <TelegramProvider>
          <main className="max-w-lg mx-auto min-h-screen bg-white">
            {children}
          </main>
        </TelegramProvider>
      </body>
    </html>
  )
}
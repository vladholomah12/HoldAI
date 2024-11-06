import './globals.css'
import type { Metadata } from 'next'

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
      <body>
        <main className="max-w-lg mx-auto min-h-screen bg-white">
          {children}
        </main>
      </body>
    </html>
  )
}
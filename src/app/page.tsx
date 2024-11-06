"use client"

import { WalletConnect } from '@/components/features/wallet-connect'
import { DailyBonus } from '@/components/features/daily-bonus'
import { useTelegram } from '@/providers/telegram-provider'
import Image from 'next/image'

export default function Home() {
  const { user, ready } = useTelegram()

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="p-4 pb-safe">
      <header className="flex items-center gap-4 mb-6">
        {user?.photoUrl ? (
          <Image
            src={user.photoUrl}
            alt={user.firstName}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200" />
        )}
        <div>
          <h1 className="font-bold">{user?.firstName || 'User'}</h1>
          <p className="text-sm text-gray-600">Balance: {user?.balance || 0} coins</p>
        </div>
      </header>

      <WalletConnect />
      <DailyBonus />
    </div>
  )
}
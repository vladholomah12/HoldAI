"use client"

import { Button } from '@/components/ui/button'
import { DailyBonus } from '@/components/features/daily-bonus'

export default function Home() {
  return (
    <div className="p-4">
      <header className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
        <div>
          <h1 className="font-bold">Username</h1>
          <p className="text-sm text-gray-600">Balance: 0 coins</p>
        </div>
      </header>
      
      <Button
        variant="outline"
        className="w-full mb-6"
      >
        Connect Wallet
      </Button>
      
      <DailyBonus />
    </div>
  )
}